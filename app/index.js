import clock from "clock";
import { display } from "display";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";

clock.granularity = "seconds";

const myLabel = document.getElementById("myLabel");
const myDate = document.getElementById("myDate");
const myHeart = document.getElementById("myHeart");
const mySteps = document.getElementById("mySteps");

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const updateSteps = () => {
  if (appbit.permissions.granted("access_activity")) {
    let steps = today.adjusted.steps;
    let newSteps = steps > 9999 ? (Math.floor(steps/1000) + 'k') : steps

    mySteps.text = newSteps
  }
}

clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let dayName = days[today.getDay()];
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = util.zeroPad(today.getDate());

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myDate.text = `${dayName}, ${monthNameShort} ${dayNumber}`;
  myLabel.text = `${hours}:${mins}`;
  
  updateSteps()
 if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const hrm = new HeartRateSensor();
    hrm.addEventListener("reading", () => {
      myHeart.text = `${hrm.heartRate}`;
    });
    display.addEventListener("change", () => {
      if (display.on) {
        hrm.start();
      }
      else {
        hrm.stop();
      }
    });

    hrm.start();
  }
}

