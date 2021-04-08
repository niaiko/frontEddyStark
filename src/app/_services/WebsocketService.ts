import { Injectable } from "@angular/core";
import * as Rx from "rxjs/Rx";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from "environments/environment";

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private stompClient;
  public data=null;

  constructor() { }

  /*connect(url) {
    var socket = new SockJS(`${environment.apiUrl}/chat`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug=null;
    this.stompClient.connect({}, () => { this.onConnected(url) }, () => { this.onError })
  }


  onConnected(url) { 
    this.stompClient.subscribe(url, (data)=>{      
      this.data=data;
    });     
  }

  onError(error) {
    console.log(error);
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }    
    console.log("Disconnected");
  }

  sendMessage(url, name) {
    //var from = document.getElementById('from').value;
    //var text = document.getElementById('text').value;
    this.stompClient.send(url, {},
      JSON.stringify({ 'input': name }));
  }

  showMessageOutput(messageOutput) {
    //

    let result = JSON.parse(messageOutput.body);
    //let listUser=JSON.parse(result.body);
    console.log('list=', result.body);
    let listUser = [];
    listUser = result.body;
    
  }*/
}