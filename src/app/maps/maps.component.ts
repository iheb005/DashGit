import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';


export class Structure{
    constructor(
        public id_struct: number,
        public nom : string,
        public mail: string
    ){}
}


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    structure : Structure[];
    closeResult: string;

  constructor( private httpclient:HttpClient,
    private modalService: NgbModal
     ) { }

  ngOnInit() {
    this.getStructures();
  }

  getStructures(){
    this.httpclient.get<any>('http://localhost:8001/structures').subscribe(response =>{
        console.log(response);
        this.structure = response;
    })
}

    open(content){
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `closed with ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

   private getDismissReason(reason: any): string{
if(reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
} else{
    return ` with : ${reason}`;
}
    }

    onSubmit(f:NgForm){
        const url = 'http://localhost:8001/addstruct';
        this.httpclient.post(url,f.value).subscribe((result) =>{
            this.ngOnInit(); //refresh table
        });
        this.modalService.dismissAll(); //dismiss modal
    }

openDetails(targetModal, structure: Structure){
this.modalService.open(targetModal, {
    centered: true,
    backdrop: 'static',
    size: 'lg'
});
document.getElementById('nom').setAttribute('value',structure.nom);
document.getElementById('mail').setAttribute('value',structure.mail);
}

    /*    var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    var mapOptions = {
        zoom: 13,
        center: myLatlng,
        scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        styles: [{
            "featureType": "water",
            "stylers": [{
                "saturation": 43
            }, {
                "lightness": -11
            }, {
                "hue": "#0088ff"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "hue": "#ff0000"
            }, {
                "saturation": -100
            }, {
                "lightness": 99
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#808080"
            }, {
                "lightness": 54
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ece2d9"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ccdca1"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#767676"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#b8cb93"
            }]
        }, {
            "featureType": "poi.park",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.sports_complex",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.medical",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.business",
            "stylers": [{
                "visibility": "simplified"
            }]
        }]

    };
*/
    //  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

   /* var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Hello World!"
    });
*/
    // To add the marker to the map, call setMap();
  //  marker.setMap(map);
  

}
