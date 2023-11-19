const base = document.querySelector(".base");
const pension = document.querySelector(".pension");
const allowance = document.querySelector(".allowance");
const allowanceTax = document.querySelector(".allowanceTaxable");
const submit = document.querySelector(".submit");
const formControl = document.querySelector(".form-control");
const form = document.getElementById("form");
const salaryDisplay = document.querySelector(".salaryDisplay");

const nis = 0.03;
const nht = 0.02;
const eduTax = 0.0225;
const incomeTax = 0.25;
const grossCap = 5000000;

submit.addEventListener("click", (e) => {
  e.preventDefault();

  if (!base.value || !pension.value) return;
  calculateNetSalary();
  displayQuickDisplay();
  showSalaryDisplay();
});

function getTaxableAllowance() {
  const allowanceValue = allowance.value;
  const allowanceTaxValue = allowanceTax.value;
  const gross = (allowanceTaxValue / 100) * allowanceValue;

  return gross;
}

function calculateGross() {
  const taxableAllowance = getTaxableAllowance();
  return parseInt(base.value) + taxableAllowance;
}

function deductPension() {
  return (parseInt(pension.value) / 100) * parseInt(base.value);
}

function deductNis() {
  const gross = calculateGross();
  return gross >= grossCap ? nis * grossCap : nis * gross;
}

function deductNht() {
  const gross = calculateGross();
  return nht * gross;
}

function getNetOfSuper() {
  return calculateGross() - deductNis() - deductPension();
}

function deductEduTax() {
  const netOfSuper = getNetOfSuper();
  const test = eduTax * netOfSuper;
  return test;
}

function deductIncomeTax() {
  const gross = calculateGross();
  const pension = deductPension();
  const nis = deductNis();
  const secondThres = 6000000;
  const firstThres = 1500096;
  const thresDiff = secondThres - firstThres;

  function getThreshold() {
    if (gross > secondThres) {
      return (
        (gross - pension - nis - secondThres) * 0.3 + thresDiff * incomeTax
      );
    } else if (gross < firstThres) {
      return 0;
    } else {
      return (gross - nis - pension - firstThres) * incomeTax;
    }
  }
  const threshold = getThreshold();
  return threshold;
}

function handleNullAllowance() {
  const allowanceValue = allowance.value;
  return allowanceValue ? allowanceValue : 0;
}

function calculateNetSalary() {
  const realGross = parseInt(base.value) + parseInt(handleNullAllowance());

  const rValue =
    realGross -
    deductNht() -
    deductEduTax() -
    deductIncomeTax() -
    deductNis() -
    deductPension();

  console.log(realGross);
  return rValue;
}

// function calculateMonthlySalary() {
//   const realGross = parseInt(base.value) + parseInt(allowance.value);
//   const mth = 12;
//   return [
//     { rg: realGross / mth },
//     { nht: deductNht() / mth },
//     { edu: deductEduTax() / mth },
//     { income: deductIncomeTax() / mth },
//     { nis: deductNis() / mth },
//     { pen: deductPension() / mth },
//   ];
// }

function displayQuickDisplay() {
  const monthlyDisplay = salaryDisplay.querySelector(".monthly");
  const annualDisplay = salaryDisplay.querySelector(".annually");

  const monthlyValue = calculateNetSalary() / 12;
  const annualValue = calculateNetSalary() / 1;

  console.log(calculateNetSalary() / 12, typeof annualValue);

  const currency = "$";
  console.log(
    `${currency} ${Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(monthlyValue)}`
  );

  monthlyDisplay.querySelector(
    "p"
  ).textContent = `${currency} ${Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(monthlyValue)}`;

  annualDisplay.querySelector(
    "p"
  ).textContent = `${currency} ${Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(annualValue)}`;
}

function showSalaryDisplay() {
  salaryDisplay.classList.add("show-drop");
}
