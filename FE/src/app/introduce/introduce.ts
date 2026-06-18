import { Component } from '@angular/core';

@Component({
  selector: 'app-introduce',
  imports: [],
  templateUrl: './introduce.html',
  styleUrl: './introduce.css',
})
export class Introduce {
  position = 50;
  dragging = false;

  onMove(event: MouseEvent) {
    if (!this.dragging) return;

    const rect =
      (event.currentTarget as HTMLElement).getBoundingClientRect();

    this.position =
      ((event.clientX - rect.left) / rect.width) * 100;

    this.position = Math.max(0, Math.min(100, this.position));
  }

}
