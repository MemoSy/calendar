"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";
import axios from "axios";

const MyCalendar = () => {
  const [active, setActive] = useState(false);
  const [event, setEvent] = useState([]);
  const [dateDay, setDates] = useState(0);
  const [days, setDays] = useState([]);
  const [date, setDate] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const celebrations = {
    "1-1": "Yılbaşı",
    "23-4": "Ulusal Egemenlik ve Çocuk Bayramı",
    "19-5": "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
    "15-7": "Demokrasi ve Milli Birlik Günü",
    "30-8": "Zafer Bayramı",
    "29-10": "Cumhuriyet Bayramı",
    // Ramazan Bayramı and Kurban Bayramı are not included because they change every year
  };

  let local;
  if (typeof window !== "undefined") {
    local = localStorage.getItem("events");
  }

  useEffect(() => {
    const calendar = document.querySelector(".calendar"),
      date = document.querySelector(".date"),
      daysContainer = document.querySelector(".days"),
      prev = document.querySelector(".prev"),
      next = document.querySelector(".next"),
      todayBtn = document.querySelector(".today-btn"),
      gotoBtn = document.querySelector(".goto-btn"),
      dateInput = document.querySelector(".date-input"),
      eventDay = document.querySelector(".event-day"),
      eventDate = document.querySelector(".event-date"),
      eventsContainer = document.querySelector(".events"),
      addEventBtn = document.querySelector(".add-event"),
      addEventWrapper = document.querySelector(".add-event-wrapper "),
      addEventCloseBtn = document.querySelector(".close "),
      addEventTitle = document.querySelector(".event-name "),
      addEventFrom = document.querySelector(".event-time-from "),
      addEventTo = document.querySelector(".event-time-to "),
      addEventSubmit = document.querySelector(".add-event-btn ");

    let today = new Date();
    let activeDay: any;
    let month = today.getMonth();
    let year = today.getFullYear();

    setSelectedDay(today.getDate());

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // const eventsArr = [
    //   {
    //     day: 13,
    //     month: 11,
    //     year: 2022,
    //     events: [
    //       {
    //         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
    //         time: "10:00 AM",
    //       },
    //       {
    //         title: "Event 2",
    //         time: "11:00 AM",
    //       },
    //     ],
    //   },
    // ];

    // @ts-ignore
    let eventsArr = [];
    if (typeof window !== "undefined") {
      eventsArr = JSON.parse(localStorage.getItem("events") || "[]");
    }
    //function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
    function initCalendar() {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const prevLastDay = new Date(year, month, 0);
      const prevDays = prevLastDay.getDate();
      const lastDate = lastDay.getDate();
      const day = firstDay.getDay();
      const nextDays = 7 - lastDay.getDay() - 1;

      // @ts-ignore
      date.innerHTML = months[month] + " " + year;
      setDate(months[month] + " " + year);

      let days = "";

      for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
      }

      for (let i = 1; i <= lastDate; i++) {
        // @ts-ignore
        const celebration = celebrations[`${i}-${month + 1}`];
        if (celebration) {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><path fill="#E30A17" d="M0 0h1200v800H0z"/><circle cx="425" cy="400" r="200" fill="#fff"/><circle cx="475" cy="400" r="160" fill="#e30a17"/><path fill="#fff" d="M583.334 400l180.901 58.779-111.804-153.885v190.212l111.804-153.885z"/></svg>`;
          const dataUrl = "data:image/svg+xml," + encodeURIComponent(svg);
          days += `<div class="day celebration"> <img src="${dataUrl}" width="40" height="30" /></div>`;
        } else {
          //check if event is present on that day
          let event = false;
          // @ts-ignore
          eventsArr.forEach((eventObj: any) => {
            if (
              eventObj.day === i &&
              eventObj.month === month + 1 &&
              eventObj.year === year
            ) {
              event = true;
            }
          });
          if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
          ) {
            activeDay = i;
            // getActiveDay(i);
            // updateEvents(i);
            if (event) {
              days += `<div class="day today active event">${i}</div>`;
            } else {
              days += `<div class="day today active">${i}</div>`;
            }
          } else {
            if (event) {
              days += `<div class="day event">${i}</div>`;
            } else {
              days += `<div class="day ">${i}</div>`;
            }
          }
        }
      }

      for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
      }
      // @ts-ignore
      daysContainer.innerHTML = days;
      // @ts-ignore
      setDays(days);

      addListner();
    }

    //function to add month and year on prev and next button
    function prevMonth() {
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      initCalendar();
    }

    function nextMonth() {
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
      initCalendar();
    }

    prev?.addEventListener("click", prevMonth);
    next?.addEventListener("click", nextMonth);

    initCalendar();

    //function to add active on day
    function addListner() {
      const daysDate = document.querySelectorAll(".day");
      daysDate.forEach((day) => {
        const days = document.querySelectorAll(".day");
        day.addEventListener("click", (e) => {
          // @ts-ignore
          setDates(Number(e.target.innerHTML));

          // @ts-ignore
          activeDay = Number(e.target.innerHTML);
          //remove active
          days.forEach((day) => {
            day.classList.remove("active");
          });
          // @ts-ignore
          getActiveDay(e.target.innerHTML);
          // @ts-ignore
          setSelectedDay(Number(e.target.innerHTML));
          //if clicked prev-date or next-date switch to that month
          // @ts-ignore
          if (e.target.classList.contains("prev-date")) {
            prevMonth();
            //add active to clicked day afte month is change
            setTimeout(() => {
              //add active where no prev-date or next-date
              const days = document.querySelectorAll(".day");
              days.forEach((day) => {
                if (
                  !day.classList.contains("prev-date") &&
                  // @ts-ignore
                  day.innerHTML === e.target.innerHTML
                ) {
                  day.classList.add("active");
                }
              });
            }, 100);
            // @ts-ignore
          } else if (e.target.classList.contains("next-date")) {
            nextMonth();
            //add active to clicked day afte month is changed
            setTimeout(() => {
              const days = document.querySelectorAll(".day");
              days.forEach((day) => {
                if (
                  !day.classList.contains("next-date") &&
                  // @ts-ignore
                  day.innerHTML === e.target.innerHTML
                ) {
                  day.classList.add("active");
                }
              });
            }, 100);
          } else {
            // @ts-ignore
            e.target.classList.add("active");
          }
        });
      });
    }

    todayBtn?.addEventListener("click", () => {
      today = new Date();
      month = today.getMonth();
      year = today.getFullYear();
      initCalendar();
    });

    dateInput?.addEventListener("input", (e) => {
      // @ts-ignore
      dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
      // @ts-ignore
      if (dateInput.value.length === 2) {
        // @ts-ignore
        dateInput.value += "/";
      }
      // @ts-ignore
      if (dateInput.value.length > 7) {
        // @ts-ignore
        dateInput.value = dateInput.value.slice(0, 7);
      }
      // @ts-ignore
      if (e.inputType === "deleteContentBackward") {
        // @ts-ignore
        if (dateInput.value.length === 3) {
          // @ts-ignore
          dateInput.value = dateInput.value.slice(0, 2);
        }
      }
    });

    gotoBtn?.addEventListener("click", gotoDate);

    function gotoDate() {
      // @ts-ignore
      const dateArr = dateInput.value.split("/");
      if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
          month = dateArr[0] - 1;
          year = dateArr[1];
          initCalendar();
          return;
        }
      }
      alert("Invalid Date");
    }

    // //function get active day day name and date and update eventday eventdate
    function getActiveDay(date: any) {
      const day = new Date(year, month, date);
      const dayName = date.toString().split(" ")[0];
      console.log(eventDay);
      // @ts-ignore
      eventDay.innerHTML = dayName;
      // @ts-ignore
      eventDate.innerHTML = date + " " + months[month] + " " + year;
    }

    getActiveDay(today.getDate());

    //function to add event
    addEventBtn?.addEventListener("click", () => {
      setActive(true);
    });

    addEventCloseBtn?.addEventListener("click", () => {
      setActive(false);
    });

    document.addEventListener("click", (e) => {
      // @ts-ignore
      if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
        setActive(false);
      }
    });

    //allow 50 chars in eventtitle
    addEventTitle?.addEventListener("input", (e) => {
      // @ts-ignore
      addEventTitle.value = addEventTitle.value.slice(0, 60);
    });

    //allow only time in eventtime from and to
    addEventFrom?.addEventListener("input", (e) => {
      // @ts-ignore
      addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
      // @ts-ignore
      if (addEventFrom.value.length === 2) {
        // @ts-ignore
        addEventFrom.value += ":";
      }
      // @ts-ignore
      if (addEventFrom.value.length > 5) {
        // @ts-ignore
        addEventFrom.value = addEventFrom.value.slice(0, 5);
      }
    });

    addEventTo?.addEventListener("input", (e) => {
      // @ts-ignore
      addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
      // @ts-ignore
      if (addEventTo.value.length === 2) {
        // @ts-ignore
        addEventTo.value += ":";
      }
      // @ts-ignore
      if (addEventTo.value.length > 5) {
        // @ts-ignore
        addEventTo.value = addEventTo.value.slice(0, 5);
      }
    });

    //function to add event to eventsArr
    addEventSubmit?.addEventListener("click", () => {
      // @ts-ignore
      const eventTitle = addEventTitle.value;
      // @ts-ignore
      const eventTimeFrom = addEventFrom.value;
      // @ts-ignore
      const eventTimeTo = addEventTo.value;
      if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all the fields");
        return;
      }

      //check correct time format 24 hour
      const timeFromArr = eventTimeFrom.split(":");
      const timeToArr = eventTimeTo.split(":");
      if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
      ) {
        alert("Invalid Time Format");
        return;
      }

      const timeFrom = convertTime(eventTimeFrom);
      const timeTo = convertTime(eventTimeTo);

      //check if event is already added
      let eventExist = false;
      eventsArr.forEach((event: any) => {
        if (
          event.day === dateDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((event: any) => {
            if (event.title === eventTitle) {
              eventExist = true;
            }
          });
        }
      });
      if (eventExist) {
        alert("Event already added");
        return;
      }

      // Rest of your code...

      const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
      };
      let eventAdded = false;
      let numbers = Number(document.querySelector(".event-day")?.innerHTML);
      if (eventsArr.length > 0) {
        eventsArr.forEach((item: any) => {
          if (
            item.day === numbers &&
            item.month === month + 1 &&
            item.year === year
          ) {
            item.events.push(newEvent);
            eventAdded = true;
          }
        });
      }

      if (!eventAdded) {
        eventsArr.push({
          day: numbers,
          month: month + 1,
          year: year,
          events: [newEvent],
        });
      }

      // Store the updated eventsArr in localStorage
      if (typeof window !== "undefined") {
        // localStorage is safe to use here
        localStorage.setItem("key", "value");
      }
      // @ts-ignore
      addEventWrapper.classList.remove("active");
      // @ts-ignore
      addEventTitle.value = "";
      // @ts-ignore
      addEventFrom.value = "";
      // @ts-ignore
      addEventTo.value = "";
    });

    //function to delete event when clicked on event
    eventsContainer?.addEventListener("click", (e) => {
      // @ts-ignore
      if (e.target.classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
          // @ts-ignore
          const eventTitle = e.target.children[0].children[1].innerHTML;
          eventsArr.forEach((event: any) => {
            if (
              event.day === activeDay &&
              event.month === month + 1 &&
              event.year === year
            ) {
              event.events.forEach((item: any, index: any) => {
                if (item.title === eventTitle) {
                  event.events.splice(index, 1);
                }
              });
              //if no events left in a day then remove that day from eventsArr
              if (event.events.length === 0) {
                eventsArr.splice(eventsArr.indexOf(event), 1);
                //remove event class from day
                const activeDayEl = document.querySelector(".day.active");
                // @ts-ignore
                if (activeDayEl.classList.contains("event")) {
                  // @ts-ignore
                  activeDayEl.classList.remove("event");
                }
              }
            }
          });
          // updateEvents(activeDay);

          // Update the events in localStorage
          if (typeof window !== "undefined") {
            // localStorage is safe to use here
            localStorage.setItem("key", "value");
          }
        }
      }
    });

    function convertTime(time: any) {
      //convert time to 24 hour format
      let timeArr = time.split(":");
      let timeHour = timeArr[0];
      let timeMin = timeArr[1];
      let timeFormat = timeHour >= 12 ? "PM" : "AM";
      time = timeHour + ":" + timeMin + " " + timeFormat;
      return time;
    }
  }, [local]);

  const [closestEvent, setClosestEvent] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stringTimeRemaining, setStringTimeRemaining] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      let events = [];
      if (typeof window !== "undefined") {
        events = JSON.parse(localStorage.getItem("events") || "[]");
      }
      const now = new Date();
      const futureEvents = events.flatMap((event: any) => {
        return event.events
          .map((e: any) => {
            const [start, end] = e.time.split(" - ");
            const [startHour, startMinute] = start.split(":");
            const [endHour, endMinute] = end.split(":");
            const startDate = new Date(
              event.year,
              event.month - 1,
              event.day,
              parseInt(startHour),
              parseInt(startMinute)
            );
            const endDate = new Date(
              event.year,
              event.month - 1,
              event.day,
              parseInt(endHour),
              parseInt(endMinute)
            );

            return {
              ...e,
              startDate,
              endDate,
            };
          })
          .filter((e: any) => e.endDate.getTime() >= now.getTime());
      });

      const sortedEvents = futureEvents.sort(
        (a: any, b: any) => a.startDate.getTime() - b.startDate.getTime()
      );

      const closestEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;
      setClosestEvent(closestEvent);

      if (closestEvent) {
        const diff = closestEvent.startDate.getTime() - now.getTime();
        const timeInSeconds = Math.floor(diff / 1000);
        const days = Math.floor(timeInSeconds / (3600 * 24));
        const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        let timeString = "";
        if (days > 0) {
          timeString += `${days}d, `;
        }
        if (timeString.length > 0 || hours > 0) {
          timeString += `${hours}h, `;
        }
        if (timeString.length > 0 || minutes > 0) {
          timeString += `${minutes}m, `;
        }
        timeString += `${seconds}s`;

        setStringTimeRemaining(timeString);
      }
    }, 1000);

    let events = [];
    if (typeof window !== "undefined") {
      events = JSON.parse(localStorage.getItem("events") || "[]");
    }
    const now = new Date();
    const futureEvents = events.filter(
      (event: any) => new Date(event.year, event.month - 1, event.day) >= now
    );
    const sortedEvents = futureEvents.sort(
      (a: any, b: any) =>
        // @ts-ignore
        new Date(a.year, a.month - 1, a.day) -
        // @ts-ignore
        new Date(b.year, b.month - 1, b.day)
    );
    const closestEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;

    const eventDate = new Date(
      closestEvent?.year,
      closestEvent?.month - 1,
      closestEvent?.day
    );
    const diff = eventDate.getTime() - now.getTime();
    const timeInSeconds = Math.floor(diff / 1000);
    setTimeRemaining(timeInSeconds);

    return () => clearInterval(timer);
  }, []);

  const [time, setTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=53b1c6f80d771212d428e5bc101e07d1&units=metric`
      );
      setWeather(response.data.main.temp);
      setCity(response.data.name);
      console.log(response.data);
    });
  }, []);

  // Get the events from localStorage and parse them back into an array
  let allEvents = [];
  if (typeof window !== "undefined") {
    allEvents = JSON.parse(localStorage.getItem("events") || "[]");
  }

  // Filter the events to only include the ones for the selected day
  const selectedDayEvents = allEvents.filter(
    (item: any) => item.day === selectedDay
  );

  return (
    <>
      <div className="containers w-[95%]  flex-col md:flex-row p-0 md:!p-[5px]">
        <h1 className="absolute bottom-2 right-8 text-[#868794]">
          7/P Sinifi tarafindan hazirlanmistir.
        </h1>
        <div className="left1 flex flex-col justify-between !w-full md:!w-[40%] !p-0 md:!p-5">
          <div className="hidden md:flex  md:translate-y-7 translate-x-7">
            <div className="text-[#878895]">Takvim</div>
          </div>
          <div className="left !p-1 md:!p-5 !w-full md:!w-full !h-min md:!h-[740px]">
            <div className="calendar !h-[65%] md:!h-full">
              <div className="month">
                <h1 className="fas fa-angle-left prev">&#8592;</h1>
                <div className="date">december 2015</div>
                <h1 className="fas fa-angle-right next">&#8594;</h1>
              </div>
              <div className="weekdays bg-[#F1F6FF] px-[10px]">
                <div>Pazar</div>
                <div>Pzt.</div>
                <div>Sali</div>
                <div>Car.</div>
                <div>Per.</div>
                <div>Cuma</div>
                <div>Cmt.</div>
              </div>
              <div className="days"></div>
              <div className="goto-today">
                <div className="goto">
                  <input
                    type="text"
                    placeholder="mm/yyyy"
                    className="date-input"
                  />
                  <button className="goto-btn">Git</button>
                </div>
                <button className="today-btn">Bugun</button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[33%] pt-6 flex justify-between items-center flex-col h-[100%] gap-28">
          {/* <h1 className="hidden md:flex text-[44px] text-[#565656]">{time}</h1> */}
          <div className="hidden md:flex text-[30px] gap-2">
            {weather ? (
              <>
                {city} ||{" "}
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  {weather}°C
                </span>
              </>
            ) : (
              "Hava durumu verileri yükleniyor..."
            )}
          </div>
          <CountdownCircleTimer
            isPlaying
            duration={timeRemaining}
            colors={"#7ADCE2"}
            size={300}
          >
            {({}) => (
              <div className="w-full h-full flex justify-center items-center text-[32px]">
                {stringTimeRemaining}
              </div>
            )}
          </CountdownCircleTimer>
        </div>
        <div className="right !w-full md:!w-[33%] -translate-y-5">
          <div className="today-date">
            <div className="event-day opacity-0"></div>
            <div className="event-date hidden md:flex">12th december 2022</div>
          </div>
          <Tabs
            defaultValue="today"
            className="w-full flex flex-col justify-center items-center gap-3"
          >
            <TabsList className="w-[90%] flex justify-around rounded-2xl bg-[#EAECFF] text-[#7D7888]">
              <TabsTrigger value="today">Bugun</TabsTrigger>
              <TabsTrigger value="everyday">Hergun</TabsTrigger>
            </TabsList>
            <TabsContent
              value="today"
              className="events !w-full !rounded-lg data-[state=active]:border-2 data-[state=active]:!h-[700px] data-[state=active]:!max-h-[620px] data-[state=active]:!w-[90%]  data-[state=active]:pt-6"
            >
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((item: any) => {
                  return item.events.map((event: any, index: any) => {
                    return (
                      <div
                        key={index}
                        className="event"
                        onClick={(e) => {
                          if (
                            confirm(
                              "Are you sure you want to delete this event?"
                            )
                          ) {
                            // Your event handling code here
                          }
                        }}
                      >
                        <div className="title">
                          <i className="fas fa-circle"></i>
                          <h3 className="event-title">{event.title}</h3>
                        </div>
                        <div className="event-time">
                          <span className="event-time">{event.time}</span>
                        </div>
                      </div>
                    );
                  });
                })
              ) : (
                <div className="no-event">
                  <h3>Etkinlik Bulunmadi</h3>
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="everyday"
              className="events !rounded-lg data-[state=active]:border-2 data-[state=active]:!h-[700px] data-[state=active]:!max-h-[620px] data-[state=active]:!w-[90%]  data-[state=active]:pt-6"
            >
              {
                // Map over the events of the selected day
                allEvents.map((item: any) => {
                  return item.events.map((event: any, index: any) => {
                    return (
                      <div
                        key={index}
                        className="event"
                        onClick={(e) => {
                          let today = new Date();
                          let month = today.getMonth();
                          let year = today.getFullYear();
                          let eventsArr = [];
                          if (typeof window !== "undefined") {
                            eventsArr = JSON.parse(
                              localStorage.getItem("events") || "[]"
                            );
                          }
                          if (confirm("Silmek istediginden eminmisin?")) {
                            const eventTitle =
                              // @ts-ignore
                              e.target?.children[0].children[1].innerHTML;
                            eventsArr.forEach((event: any) => {
                              event.events.forEach((item: any, index: any) => {
                                if (item.title === eventTitle) {
                                  event.events.splice(index, 1);
                                }
                              });
                              //if no events left in a day then remove that day from eventsArr
                              if (event.events.length === 0) {
                                eventsArr.splice(eventsArr.indexOf(event), 1);
                                //remove event class from day
                                const activeDayEl =
                                  document.querySelector(".day.active");
                                if (activeDayEl?.classList.contains("event")) {
                                  activeDayEl.classList.remove("event");
                                }
                              }
                            });
                            // updateEvents(activeDay);

                            // Update the events in localStorage
                            if (typeof window !== "undefined") {
                              // localStorage is safe to use here
                              localStorage.setItem("key", "value");
                            }
                          }
                        }}
                      >
                        <div className="title">
                          <i className="fas fa-circle"></i>
                          <h3 className="event-title">{event.title}</h3>
                        </div>
                        <div className="event-time">
                          <span className="event-time">{event.time}</span>
                        </div>
                      </div>
                    );
                  });
                })
              }
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full flex justify-center items-center sticky md:absolute bottom-5">
          <div
            className={`add-event-wrapper ${
              active ? "active" : ""
            } !-translate-x-0 md:!translate-x-[15px]`}
          >
            <div className="add-event-header">
              <div className="title">Etkinlik Ekle</div>
              <i className="fas fa-times close"></i>
            </div>
            <div className="add-event-body">
              <div className="add-event-input">
                <input
                  type="text"
                  placeholder="Etkinlik Adi"
                  className="event-name"
                />
              </div>
              <div className="add-event-input">
                <input
                  type="text"
                  placeholder="Etkinlik Zamanı Başlangıç Tarihi"
                  className="event-time-from"
                />
              </div>
              <div className="add-event-input">
                <input
                  type="text"
                  placeholder="Etkinlik Zamanı Bitis Tarihi"
                  className="event-time-to"
                />
              </div>
            </div>
            <div className="add-event-footer">
              <button className="add-event-btn">Etkinlik Ekle</button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center sticky md:absolute bottom-0 -translate-x-4">
          <button className="add-event !h-[50px] !w-[50px] md:!w-[130px] md:!h-[40px] !shadow-xl">
            <p className="hidden md:flex">Etkinlik Ekle</p>
            <i className="fas fa-plus">+</i>
          </button>
        </div>
      </div>
    </>
  );
};

export default MyCalendar;
