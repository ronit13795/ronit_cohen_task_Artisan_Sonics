import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  selectedSearch = '';
  fitPlaceHolder = '';
  valueForSearch = '';
  errorMessage = '';
  patients: {
    ID: string;
    First: string;
    Last: string;
    LMP: string;
    DOB: string;
    Age: string;
    GA: string;
  }[] = [];
  unsortedPatients: {
    ID: string;
    First: string;
    Last: string;
    LMP: string;
    DOB: string;
    Age: string;
    GA: string;
  }[] = [];
  sortType = '';

  ngOnInit() {
    fetch('http://127.0.0.1:3000/patients/find')
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        this.patients = json;
        this.unsortedPatients = json;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  onSelectedSearch(type: string) {
    this.selectedSearch = type;
    if (!type) {
      this.fitPlaceHolder = 'please choose option';
      return;
    }
    this.fitPlaceHolder = `insert ${type}`;
  }

  filteredBy(value: string) {
    this.valueForSearch = value;
    if (!value) {
      this.patients = this.unsortedPatients;
      this.errorMessage = '';
    }
  }

  sortBy(type: string) {
    this.sortType = type;
    switch (type) {
      case '':
        this.patients = [...this.unsortedPatients];
        break;
      case 'AGE':
        this.sortByAge();
        break;
      case 'GA':
        this.sortByGa();
        break;
    }
  }

  sortByAge() {
    let patientsCopy = [...this.patients];
    patientsCopy.sort((patientA, patientB) => {
      let patientAAge = patientA.Age.split('y');
      let yearsPatientA = Number(patientAAge[0]);
      let monthsPatientA = Number(patientAAge[1].replace('m', ''));
      let patientBAge = patientB.Age.split('y');
      let yearsPatientB = Number(patientBAge[0]);
      let monthsPatientB = Number(patientBAge[1].replace('m', ''));
      if (yearsPatientA > yearsPatientB) {
        return -1;
      }
      if (yearsPatientB > yearsPatientA) {
        return 1;
      }
      if (monthsPatientA > monthsPatientB) {
        return -1;
      }
      if (monthsPatientA < monthsPatientB) {
        return -1;
      }
      return 0;
    });
    this.patients = patientsCopy;
  }

  sortByGa() {
    let patientsCopy = [...this.patients];
    patientsCopy.sort((patientA, patientB) => {
      let patientAGa = patientA.GA.split('w');
      let weeksPatientAGa = Number(patientAGa[0]);
      let daysPatientAGa = Number(patientAGa[1].replace('d', ''));
      let patientBGa = patientB.GA.split('w');
      let weeksPatientB = Number(patientBGa[0]);
      let daysPatientBGa = Number(patientBGa[1].replace('d', ''));
      if (weeksPatientAGa > weeksPatientB) {
        return -1;
      }
      if (weeksPatientB > weeksPatientAGa) {
        return 1;
      }
      if (daysPatientAGa > daysPatientBGa) {
        return -1;
      }
      if (daysPatientAGa < daysPatientBGa) {
        return -1;
      }
      return 0;
    });
    this.patients = patientsCopy;
  }

  search() {
    fetch(
      `http://127.0.0.1:3000/patients/find?${this.selectedSearch}=${this.valueForSearch}`
    )
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        if (!json.length) {
          this.errorMessage = 'No match exists';
          this.patients = json;
          return;
        }
        this.errorMessage = '';
        this.patients = json;
        if (this.sortType === 'AGE') {
          this.sortByAge();
        }
        if (this.sortType === 'GA') {
          this.sortByGa();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
