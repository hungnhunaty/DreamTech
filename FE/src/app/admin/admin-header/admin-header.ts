import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, pipe } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  imports: [DatePipe],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  pageTitle = "";

  today = new Date();
  constructor(private router:Router, private route:ActivatedRoute){

  }

  ngOnInit(){
    this.updateTitle();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateTitle();
    });
  }


  private updateTitle() {

  let currentRoute = this.route.firstChild;

  while (currentRoute?.firstChild) {
    currentRoute = currentRoute.firstChild;
  }

  this.pageTitle =
    currentRoute?.snapshot.data['title'] ?? '';
}
}

