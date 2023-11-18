const base = document.querySelector(".base");
const pension = document.querySelector(".pension");
const allowance = document.querySelector(".allowance");
const allowanceTax = document.querySelector(".allowanceTaxable");
const submit = document.querySelector(".submit");
const formControl = document.querySelector(".form-control");
const form = document.getElementById("form");

const nis = 0.03;
const nht = 0.02;
const eduTax = 0.0225;
const incomeTax = 0.25;
const grossCap = 5000000;

submit.addEventListener("click", (e) => {
  e.preventDefault();

  if (!base.value || !allowance.value || !allowanceTax.value) return;
  calculateNetSalary();
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

function calculateDeductions() {
  const gross = calculateGross();
  const nisDeduction = nis * gross;
  const nhtDeduction = nht * gross;

  return [nisDeduction, nhtDeduction];
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
    } else {
      return (gross - nis - pension - firstThres) * incomeTax;
    }
  }
  const threshold = getThreshold();
  return threshold;
}

function calculateNetSalary() {
  const gross = calculateGross();
  const netSuper = getNetOfSuper();

  console.log(netSuper - deductNht() - deductEduTax() - deductIncomeTax());
}
