import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {}
/*export class ConfirmationDialogService {
  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Confirmer',
    btnCancelText: string = 'Annuler',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}*/
