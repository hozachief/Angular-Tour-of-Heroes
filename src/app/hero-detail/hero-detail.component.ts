/*
Routable HeroDetailComponent
Previously, the parent HeroesComponent set the HeroDetailComponent.hero property
and the HeroDetailComponent displayed the hero. HeroesComponent does not
do that anymore. Now the router creates the HeroDetailComponent in response to
a URL such as -/detail/11.
HeroDetailComponent needs a new way to obtain the hero-to-display
Get the route that created it.
Extract the id from the route.
Acquire the hero with that id from the server via the HeroService.
*/

/* Amend the @angular/core import statement to include the Input symbol */
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

/* HeroDetailComponent template binds to the component's hero property which
is of type Hero. */
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  /* The hero property must be an Input property, annotated with the @Input()
  decorator, because the external HeroesComponent will bind to it like this.
  <app-hero-detail [hero]="selectedHero"></app-hero-detail> */
  @Input() hero: Hero;
  //hero: Hero;
  
  /* 
  Inject the ActivatedRoute, HeroService, and Location services into the
  constructor, saving their values in private fields. 
  The ActivatedRoute holds information about the route to this instance of the HeroDetailComponent.
  This component is interested in the route's bag of parameters extracted from the URL.
  The "id" parameter is the id of the hero to display.
  The heroService gets hero data from the remote server and this component will use
  it to get the hero-to-display.
  The location is an Angular service for interacting with the browser. You'll use it
  later to navigate back to the view that navigated here.
  */
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  /* Extract the id route parameter */
  ngOnInit(): void {
    this.getHero();
  }

  /*
  The route.snapshot is a static image of the route information shortly after the
  component was created. The paramMap is a dictionary of route parameter values 
  extracted from the URL. The "id" key returns the id of the hero to fetch.
  Route parameters are always strings. The JavaScript (+) operator converts the string
  to a number, which is what a hero id should be.
  */
  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  /* Add a goBack() method to the component class that navigates backward one step in the
  browser's history stack using the Location service that you injected previously.
  */
  goBack(): void {
    this.location.back();
  }

  /**
   * Persists hero name changes using the hero service updateHero() method and then
   * navigates back to the previous view.
   */
  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}
