import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tag } from '../../shared/models/tag.model';
@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly apiUrl = 'http://localhost:8080/tags';

  constructor(private http: HttpClient) { }

  searchTags(query: string): Observable<tag[]> {
    return this.http.get<tag[]>(`${this.apiUrl}/search?query=${query}`, { withCredentials: true });
    }



}