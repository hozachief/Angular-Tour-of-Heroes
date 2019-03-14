/* 
You generally do not declare components in a routing module...
Will configure the router with Routes in the RouterModule so import those
two symbols from the @angular/router library. 

Add routes
Routes tell the router which view to display when a user clicks a link or
pastes a URL into the browser address bar.
A typical Angular Route has two properties:
path: a string that matches the URL in the browser address bar.
component: the component that the router should create when navigating to this route.
You intend to navigate to the HeroesComponent when the URL is something like
localhost:4200/heroes.
Import the HeroesComponent so you can reference it in a Route. Then define
an array of routes with a single route to that component. 

Add the dashboard route
To navigate to the dashboard, the router needs an appropriate route.
import the DashboardComponent in the AppRoutingMdoule.
Add a route to the AppRoutingModule.routes array that matches a path to the
DashboardComponent.
When the app starts, the browsers address bar points to the web site's root.
That doesn't match any existing route so the router doesn't navigate anywhere.
The space below the <router-outlet> is blank.
To make the app navigate to the dashboard automatically, add the following route
to the AppRoutingModule.Routes array.
{ path: '', redirectTo: '/dashboard', pathMatch: 'full'},
This route redirects a URL that fully matches the empty path to the route whose
path is '/dashboard'.

Navigating to hero details
The HeroDetailsComponent displays details of a selected hero. At the moment the
HeroDetailsComponents is only visible at the bottom of the HeroesComponent.
The user should be able to get to these details in three ways.
By clicking a hero in the dashboard.
By clicking a hero in the heroes list.
By pasting a "deep link" URL into the browser address bar that identifies the hero to display.
We will enable navigation to the HeroDetailsComponent and liberate it from the HeroesComponent.

Add a hero detail route
A URL like -/detail/11 would be a good URL for navigating to the Hero Detail view
of the hero whose id is 11.
Add a paramatized route to the AppRoutingModule.routes array that matches the path
pattern to the hero detail view.
The colon (:) in the path indicates that :id is a placeholder for a specific hero id.
{ path: 'detail/:id', component: HeroDetailComponent },

At this point, all application routes are in place
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

/* Just a little observation: Order very much matters.*/
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent }
];

/* Add an @NgModule.exports array with RouterModule in it. Exporting RouterModule
makes router directives available for use in the AppModule components that will
need them.
RouterModule.forRoot()
First must initialize the router and start it listening for browser location changes.
Add RouterModule to the @NgModule.imports array and configure it with
the routes in one step by calling RouterModule.forRoot() within the imports array.
The method is called forRoot() because you configure the router at the application's
root level. The forRoot() method supplies the service providers and directives needed
for routing, and performs the initial navigation based on the current browser URL.*/
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
