import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Checkpoint} from '../../models/stock.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {
  private apiUrl = `${environment.apiUrl}/checkpoints`;

  checkpointsDropdown: any[] = []
  checkpoint = new BehaviorSubject<Checkpoint | null>(null);

  constructor(private http: HttpClient) { }

  getCheckpointDropdown() {
    this.http.get<any[]>(this.apiUrl + '/summary').subscribe({
      next: data => {
        this.checkpointsDropdown = data
      }
    });
  }
  getCheckpointDetail(id: number) {
    this.http.get<any>(this.apiUrl + '/' + id).subscribe({
      next: data => {
        this.checkpoint.next(data);
      }
    });
  }
  updateCheckpointDetail(id: number, payload: FormData) {
    return this.http.put(this.apiUrl + '/' + id, payload)
  }
}
