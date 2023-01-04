require("dotenv").config({ path: __dirname + "/../.env" });
const differenceInMonths = require("date-fns/differenceInMonths");
const differenceInWeeks = require("date-fns/differenceInWeeks");
const reader = require("xlsx");
const db = require("../db/dbcon");

const readXlsxData = ({ fileName, sheetName }) => {
  const data = [];
  const file = reader.readFile(fileName);
  const temp = reader.utils.sheet_to_json(file.Sheets[sheetName], {
    raw: false,
  });
  temp.forEach((res) => {
    data.push(res);
  });
  return data;
};

const calculateAge = (DOB) => {
  // example 17.9.1993
  let [pDay, pMonth, pYear] = DOB.split(".");
  pMonth -= 1;
  const fullMonths = differenceInMonths(
    new Date(),
    new Date(pYear, pMonth, pDay)
  );
  const years = Math.floor(fullMonths / 12);
  const months = fullMonths % 12;
  return `${years}y${months}m`;
};

const calculateGA = (LMP) => {
  // example 30/11/2022
  let [pMonth, pDay, pYear] = LMP.split("/");
  pMonth -= 1;
  pYear = `20${pYear}`;
  const fullWeeks = differenceInWeeks(
    new Date(),
    new Date(pYear, pMonth, pDay, 2)
  );
  const days = fullWeeks % 7;
  return `${fullWeeks}w${days}d`;
};

const initData = async () => {
  console.log(`Reading Xlsx Data ...`);
  const patientsRaw = readXlsxData({
    fileName: "./patientList.xlsx",
    sheetName: "raw data",
  });

  console.log(`Calculating Raw Patients ...`);
  const patients = patientsRaw.map((patient) => {
    return {
      "ID#": patient["ID#"],
      First: patient.First,
      Last: patient.Last,
      LMP: patient["LMP date and time"],
      DOB: patient.DOB,
      Age: calculateAge(patient.DOB),
      GA: calculateGA(patient["LMP date and time"]),
    };
  });

  // console.log(patients);

  const createPatients = `create table if not exists patients(
        ID varchar(255) not null primary key,
        First varchar(255) not null,
        Last varchar(255) not null,
        LMP varchar(255) not null,
        DOB varchar(255) not null,
        Age varchar(255) not null,
        GA varchar(255) not null
    )`;

  try {
    console.log(`Creating Patient Table ...`);
    await db.query({ query: createPatients });
  } catch (err) {
    console.log(`Error while creating 'patients table '${err}`);
    throw err;
  }

  const patientsValues = patients.map(
    (patient) =>
      `(${String(Object.values(patient).map((value) => `'${value}'`))})`
  );

  const insertMultiplePatients = `INSERT INTO patients (ID, First, Last, LMP, DOB, Age, GA) VALUES ${String(
    patientsValues
  )}`;

  console.log(`Adding Patients ...`);
  try {
    await db.query({ query: insertMultiplePatients });
  } catch (err) {
    console.log(`Error while inserting patients into table '${err}`);
    throw err;
  }

  console.log(`Script finished successfully ...`);
};
initData();
