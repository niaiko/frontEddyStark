import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { WebsocketService } from "./WebsocketService";

const MSG_URL = "ws://localhost:8080/secured/room"; ///secured/room

export interface Message {
  author: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    /*this.messages = <Subject<Message>>wsService.connect(MSG_URL).map(
      (response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          author: data.author,
          message: data.message
        };
      }
    );*/
  }
}