let characteristic;
const connectButton = document.querySelector("#connect");
const body = document.querySelector("#body");
const stopAlarmBtn = document.querySelector("#stop");
const alert = new Audio("./assets/mp3/alert.mp3");
let lastValue = null;

let alertPlayed = false;

const connect = async () => {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [0xffe0],
  });

  const server = await device.gatt.connect();

  const service = await server.getPrimaryService(0xffe0);

  characteristic = await service.getCharacteristic(0xffe1);

  await characteristic.startNotifications();

  characteristic.addEventListener("characteristicvaluechanged", handleData);
  connectButton.textContent = "Connected";
};

connectButton.addEventListener("click", connect);

// const blinkBG = () => {
//   body.style.backgroundColor = "red";
//   setTimeout(() => {
//     body.style.backgroundColor = "black";
//   }, 500);
// };

const handleData = (e) => {
  let value = new TextDecoder().decode(e.target.value).trim();

  if (
    value.match(/intruder!/i) ||
    (value === "intruder!" && alertPlayed === false)
  ) {
    alert.play();
    body.style.backgroundColor = "red";
  } else if (value !== "intruder!" && alertPlayed === true) {
    alert.pause();
    body.style.backgroundColor = "black";
  } else {
    alert.pause();
    body.style.backgroundColor = "black";
  }

  console.log(value);
};

stopAlarmBtn.addEventListener("click", () => {
  alertPlayed = false;
});
