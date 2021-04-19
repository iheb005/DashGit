import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

export class User {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
//    public department: string,
    public email: string,
 //   public country: string
    public active: boolean
 ) {
  }
}

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
users: User[];
public closeResult: string;
  constructor(private httpclient: HttpClient,
    private modalService: NgbModal ) { }
 
  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this.httpclient.get<any>('http://localhost:8001/getusers').subscribe(response =>{
      console.log(response);
      this.users =response;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8001/adduser';
    this.httpclient.post(url, f.value).subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

}
