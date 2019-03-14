/* AppModule
Angular needs to know how the pieces of your application fit together and what other files
and libraries the app requires. This information is called metadata.
Some of the metadata is in the @Component decorators. Other critical metadata is in @NgModule
decorators. The most important @NgModule decorator annotates the top-level AppModule class. 

Enable HTTP services
HttpClient is Angular's mechanism for communicating with a remote server over HTTP.
To make HttpClient available everywhere in the app:
open the root AppModule
import the HttpClientModule symbol from @angular/common/http
add it to the @NgModule.imports array

Simulate a data server
This tutorial sample mimics communication with a remote data server by using the
In-memory Web API module.
After installing the module, the app will make requests to and receive responses from
the HttpClient without knowing that the In-memory Web API is intercepting those requests,
applying them to an in-memory data store, and returning simulated responses.
This facility is a great convenience for the tutorial. You won't have to set up a
server to learn about HttpClient.
It may also be convenient in the early stages of your own app development when the
server's web api is ill-defined or not yet implemented.
*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/* Import the FormsModule symbol from the @angular/forms library */
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { MessagesComponent } from './messages/messages.component';

/* @NgModule metadata array, the imports array contains a list of external modules that the
app needs. 
The HeroesComponent is declared in the @NgModule.declarations array.

The forRoot() configuration method takes an InMemoryDataService class that primes
the in-memory database.
*/
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent
  ],
  //providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
