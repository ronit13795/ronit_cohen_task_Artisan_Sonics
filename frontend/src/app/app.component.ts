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
        this.patients = this.unsortedPatients.filter((patient) => {
          for (const { ID } of this.patients) {
            if (patient.ID === ID) return true;
          }
          return;
        });
        break;
      case 'AGE':
        this.sortByAge();
        break;
      case 'GA':
        this.sortByGa();
        break;
    }
  }

  parseField(value: string, splitBy: string, removeChar: string) {
    const [first, sec] = value.split(splitBy);
    const firstNumber = Number(first);
    const secNumber = Number(sec.replace(removeChar, ''));
    return [firstNumber, secNumber];
  }

  sortByAge() {
    let patientsCopy = [...this.patients];
    patientsCopy.sort((patientA, patientB) => {
      const [yearsA, monthsA] = this.parseField(patientA.Age, 'y', 'm');
      const [yearsB, monthsB] = this.parseField(patientB.Age, 'y', 'm');

      if (yearsA > yearsB) {
        return -1;
      }
      if (yearsB > yearsA) {
        return 1;
      }
      if (monthsA > monthsB) {
        return -1;
      }
      if (monthsA < monthsB) {
        return -1;
      }
      return 0;
    });
    this.patients = patientsCopy;
  }

  sortByGa() {
    const patientsCopy = [...this.patients];
    patientsCopy.sort((patientA, patientB) => {
      const [weeksA, daysA] = this.parseField(patientA.GA, 'w', 'd');
      const [weeksB, daysB] = this.parseField(patientB.GA, 'w', 'd');
      if (weeksA > weeksB) {
        return -1;
      }
      if (weeksB > weeksA) {
        return 1;
      }
      if (daysA > daysB) {
        return -1;
      }
      if (daysA < daysB) {
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
