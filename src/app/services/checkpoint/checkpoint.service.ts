import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {
  private apiUrl = `${environment.apiUrl}/checkpoints`;

  checkpointsDropdown: any[] = []

  constructor(private http: HttpClient) { }

  getCheckpointDropdown() {
    this.http.get<any[]>(this.apiUrl + '/summary').subscribe({
      next: data => {
        this.checkpointsDropdown = data
      }
    });
  }
}
