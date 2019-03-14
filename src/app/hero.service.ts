/* Components should not fetch or save data directly and they certainly shouldn't
knowingly present fake data. They should focus on presenting data and delagate
data access to a service.
We will create a HeroService that all application classes can use to get heroes.
Will rely on Angular dependency injection to inject it into the HeroesCompnent constructor.
Services are a great way to share information among classes that don't know each other.
Will create MessageService and inject it in two places:
in HeroService which uses the service to send a message.
in MessagesComponent which displays that message

The new service imports the Angular Injectable symbol and annotates the class with
the @Injectable() decorator. This marks the class as one that participates in the
dependency injection system.
The HeroService class is going to provide an injectable service, and it can also have its
own injected dependencies.
HeroService could get hero data from anywhere- a web service, local storage, or a mock
data source.
Removing data access from components means you can change your mind about the implementation
anytime, without touching any components.
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* Observable is one of the key classes in the RxJS library. */
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};


/* The @Injectable() decorator accepts a metadata object for the service, the same
way the @Component() decorator did for your component classes.
When you provide the service at the root level, Angular creates a single, shared
instance of HeroService and injects into any class that asks for it.
Registering the provider in the @Injectable metadata also allows Angular to optimize
an app by removing the service if it turns out not to be used after all. */
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  /* Define the heroesUrl of the form :base/:collectionName with the address of the
  heroes resource on the server. Here base is the resource to which requests are made,
  and collectionName is the heroes data object in the in-memory-data-service.ts. */
  private heroesUrl = 'api/heroes'; // URL to web api

  //heroes: Hero[];

  /* Inject MessageService into HeroService
  Modify the constructor with a parameter that declares a private messageService property.
  Angular will inject the singleton MessageService into that property when it creates
  the HeroService.
  This is a typical "service-in-service" scenario: you inject the MessageService into
  the HeroService which is injected into the HeroesComponent. */
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /* HeroService.getHeroes() method has a synchronous signature...
  this will not work in a real app. The app will fetch heroes from a remote server,
  which is an inherently asynchronous operation.
  The HeroService must wait for the server to respond, getHeroes() cannot return immediately
  with hero data, and the browser will not block while the service waits.
  HeroService.getHeroes() must have an asynchronous signature of some kind.
  It can take a callback. It could return a Promise. It could return an Observable.
  In this tutorial, HeroService.getHeroes() will return an Observable in part because it
  will eventually use the Angular HttpClient.get method to fetch the heroes and
  HttpClient.get() returns an Observable. 
  of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock
  heroes. 
  HeroService.getHeroes method used to return a Hero[]. Now it returns an
  Observable<Hero[]>. You will have to adjust to that difference in HeroesComponent.
  Modify the getHeroes method to send a message when the heroes are fetched. 
  
  Get heroes with HttpClient
  The current HeroService.getHeroes() uses the RxJS of() function to return an array of
  mock heroes as an Observable<Hero[]>.
  Convert that method to use HttpClient.
  The hero data should successfully load from the mock server.
  You've swapped 'of' for http.get and the app keeps working without any other changes
  because both functions return an Observable<Hero[]>.
  
  Http methods return one value
  All HttpClient methods return an RxJS Observable of something.
  HTTP is a request/repsonse protocol. You make a request, it returns a single response.
  In general, an observable can return multiple values over time. An Observable from
  HttpClient always emits a single value and then completes, never to emit again.
  This particular HttpClient.get call returns an Observable<Hero[]>, literally
  "an observable of hero arrays". In practice, it will only return a single hero array.
  
  HttpClient.get returns response data
  HttpClient.get returns the body of the response as an untyped JSON object by default.
  Applying the optional type specifier, <Hero[]>, gives you a typed result object.
  The shape of the JSON data is determined by the server's data API. The Tour of Heroes
  data API returns the hero data as an array.
  Other APIs may bury the data that you want within an object. You might have to dig that
  data out by processing the Observable result with the RxJS map operator. Although
  not discussed here, there's an example of map in the getHeroNo404() method included
  in the sample source code.

  Error handling
  Things go wrong, especially when you're getting data from a remote server. The
  HeroService.getHeroes() method should catch errors and do something appropriate.
  To catch errors, you "pipe" the observable result from http.get() through an RxJS
  catchError() operator.
  catchError() operator intercepts an Observable that failed. It passes the error
  an error handler that can do what it wants with the error.

  Tap into the Observable
  The HeroService methods will tap into the flow of observable values and send a
  message (via log()) to the message area at the bottom of the page.
  They will do that with the RxJS tap operator, which looks at the observable values,
  does something with those values, and passes them along. The tap call back doesn't
  touch the values themselves.
  
  GET heroes from the server
  */
  getHeroes(): Observable<Hero[]> {
    //this.heroes = this.heroService.getHeroes();
    // TODO: send the message _after_ fetching the heroes (i.e. for now code line below)
    //this.messageService.add('HeroService: fetched heroes');
    //return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
        );
  }

  /**
   * 
   * GET hero by id. Return undefined when id not found
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /* Note the backticks (``) that define a JavaScript template literal for embedding the id.
  Like getHeroes(), getHero() has an asynchronous signature. It returns a mock hero as an
  Observable, using the RxJS of() function. You will be able to re-implement getHero() as
  a real Http request without having to change the HeroDetailComponent that calls it.
  
  Get hero by id
  Most web APIs support a get by id request in the form :baseURL/:id.
  Here, the base URL is the heroesURL defined in the Heroes and HTTP section (api/heroes) and
  id is the number of the hero that you want to retrieve.

  There are three significant differences from getHeroes()
  it constructs a request URL with the desired hero's id.
  the server should respond with a single hero rather than an array of heroes.
  therefore, getHero returns an Observable<Hero> ("an observable of Hero objects")
  rather than an observable of hero arrays.

  GET hero by id. Will 404 if id not found
  */
  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    //return of(HEROES.find(hero => hero.id === id));
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /**
   * Search by name
   * In this last exercise, you learn to chain Observable operators together so you can
   * minimize the number of similar HTTP requests and consume network bandwidth economically.
   * You will add a heroes search feature to the Dashboard. As the user types a name into a search
   * box, you'll make repeated HTTP requests for heroes filtered by that name. Your goal is
   * to issue only as many requests as necessary.
   * 
   * HeroService.searchHeroes
   * The method returns immediately with an empty array if there is no search term. The rest of it
   * closely resembles getHeroes(). The only significant difference is the URL, which includes a
   * query string with the search term.
   * 
   * GET heroes whose name contains search term
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  // Save methods //

  /**
   * Add HeroService.addHero()
   * HeroService.addHero() differs from updateHero in two ways.
   * it calls HttpClient.post() instead of put().
   * it expects the server to generate an id for the new hero, which it returns
   * in the Observable<Hero> to the caller.
   * 
   * POST: add a new hero to the server
   */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
   * Add HeroService.deleteHero()
   * Note that
   * it calls HttpClient.delete.
   * the URL is the heroes resource URL plus the id of the hero to delete.
   * you don't send data as you did with put and post.
   * you still send the httpOptions.
   * 
   * DELETE: delete the hero from the server
   */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
   * Add HeroService.updateHero()
   * The overall structure of the updateHero() method is similar to that of
   * getHeroes(), but it uses http.put() to persist the changed hero on the server.
   * 
   * The HttpClient.put() method takes three parameters
   * the URL
   * the data to update (the modified hero in this case)
   * options
   * 
   * The URL is unchanged. The heroes web API knows which hero to update by looking at
   * the hero's id.
   * The heroes web API expects a special header in HTTP save requests. That header is in
   * the httpOptions constant defined in the HeroService.
   * 
   * const httpOptions = {
   *  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   * };
   * 
   * JoseNote: So that special header will not be needed and will be something else
   * since you won't be using the web API when you actually communicate with the server.
   * And notice it is the options parameter of HttpClient.put() method so probably not going
   * to be a big deal.
   * 
   * Change a hero name and save your change. Navigating to the previous view is implemented
   * in the save() method defined in HeroDetailComponent. The hero now appears in the list
   * with the changed name.
   * 
   * PUT: update the hero on the server
   */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * handleError() method reports the error and then returns an innocuous
   * result so that the application keeps working.
   * handleError() will be shared by many HeroService methods so it's generalized to meet
   * their different needs. Instead of handling the error directly, it returns an error
   * handler function to catchError that it has configured with both the name of the
   * operation that failed and a safe return value.
   * After reporting the error to console, the handler constructs a user friendly
   * message and returns a safe value to the app so it can keep working.
   * Each service method returns a different kind of Observable result,
   * handleError() takes a type parameter so it can return the safe value as the
   * type that the app expects.
   * 
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }

  /**
  * Keep injecting the MessageService. You'll call it so frequently that you'll wrap it
  * in a private log() method.
  * 
  * Log a HeroService message with the MessageService 
  */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
