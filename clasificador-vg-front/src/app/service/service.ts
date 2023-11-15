import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroDto } from 'app/dto/registro-dto';
const back_end_url = "https://predictor-violencia-genero.onrender.com/"

@Injectable({
  providedIn: 'root'
})
export class Service {

  constructor(private httpClient : HttpClient) { }

  public obtenerDF() : Observable<any> {
    return this.httpClient.get(back_end_url + 'obtener_df/');
  }

  public predecir(registroDTO : RegistroDto) : Observable<any> {
    return this.httpClient.post<any>(back_end_url + 'predecir/', registroDTO);
  }

 
}
