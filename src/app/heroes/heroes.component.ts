/* 
Remove dead code
While the HeroesComponent class still works, the onSelect() method and
selectedHero property ar no longer used.
It's nice to tidy up and you will be grateful to yourself later.
*/

import { Component, OnInit } from '@angular/core';

/* Import the Hero class (i.e. src/app/hero.ts). */
import { Hero } from '../hero';
/* Import the mock-heroes class (i.e. src/app/mock-heroes.ts)*/
//import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';

/* Component symbol from the Angular core library. Annotate the component class
with @Component. @Component is a decorator function that specifies the Angular
metadata for the component. 
The CLI generated three metadata properties:
selector- the component's CSS element selector
templateUrl- the location of the component's template file.
styleUrls- the location of the component's private CSS styles. 
The CSS element selector, 'app-heroes', matches the name of the HTML element that
identifies this component within a parent component's template. */
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  /* Add the click event handler
  Component's hero property name.
  */
  //selectedHero: Hero;

  /* Define a component property called heroes to expose HEROES array for binding. */
  //heroes = HEROES;
  heroes: Hero[];

  /* Parameter simultaneously defines a private heroService property and identifies it
  as a HeroService injection site */
  constructor(private heroService: HeroService) { }

  /* A lifecycle hook. Angular calls ngOnInit shortly after creating a component.
  A good place to put initialization logic. Always export the component class so
  you can import it elsewhere...like AppModule.
  Call getHeroes() inside the ngOnInit lifecycle hook and let Angular call ngOnInit
  at an appropriate time after constructing a HeroesComponent instance. */
  ngOnInit() {
    this.getHeroes();
  }

  /* onSelect() method, which assigns the clicked hero from the template to
  the component's selectedHero. */
  /*onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }*/

  /*
  Observable.subscribe() is the critical difference.
  The previous version assigns an array of heroes to the component's heroes property.
  The assignment occurs synchronously...won't work when the HeroService is acutally making
  requests of a remote server.
  This new version waits for the Observable to emit the array of heroes- which could happen
  now or several minutes from now. Then subscribe passes the emitted array to the callback,
  which sets the component's heroes property. Asynchronous approach...*/
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  /**
   * In response to a click event, call the component's click handler and then clear the
   * input field so that its ready for another name.
   * When the given name is non-blank, the handler creates a Hero-like object from the name (it's only
   * missing the id) and passes it to the services addHero() method.
   * When addHero saves successfully, the subscribe callback receives the new hero and pushes it into
   * to the heroes list for display.
   */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  /**
   * Although the component delegates hero deletion to the HeroService,
   * it remains responsible for updating its own list of heroes. The component's delete() method
   * immediately removes the hero-to-delete from that list, anticipating that the HeroService
   * will succeed on the server.
   * There's really nothing for the component to do with the Observable returned by
   * heroService.delete(). It must subscribe anyway.
   * If you neglect to subscribe(), the service will not send the delete request to the server!
   * As a rule, an Observable does nothing until something subscribes! Confirm this for yourself
   * by temporarily removing the subscribe(), clicking "Dashboard", then clicking "Heroes".
   * You'll see the full list of heroes again.
   */
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
