import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

}
