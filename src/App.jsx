import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

function App() {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([
        { id: '1', title: 'Event 1', start: '2025-02-02T00:00:00', end: '2025-02-05T00:00:00', resourceId: 'a', color: '#FFA0A0', hoverColor: '#FF7675', clickColor: 'rgb(226, 0, 0)', textColor: 'black'},
        { id: '2', title: 'Event 2', start: '2025-02-10T09:00:00', end: '2025-02-15T15:00:00', resourceId: 'c', color: '#C8CBE6', hoverColor: '#ACC3E6', clickColor: 'rgb(73, 129, 214)', textColor: 'black'},
        { id: '3', title: 'Event 3', start: '2025-02-11T00:00:00', end: '2025-02-14T00:00:00', resourceId: 'd', color: '#FEB0FF', hoverColor: '#FF96FA', clickColor: 'rgb(226, 93, 210)', textColor: 'black'},
        { id: '4', title: 'Event 4', start: '2025-02-15T07:00:00', end: '2025-02-20T12:00:00', resourceId: 'e', color: '#C1F2C9', hoverColor: '#9DF2A1', clickColor: 'rgb(29, 171, 47)', textColor: 'black'},
        { id: '5', title: 'Event 5', start: '2025-02-02T00:00:00', end: '2025-02-09T00:00:00', resourceId: 'f', color: '#F7FCC4', hoverColor: '#F9FC94', clickColor: 'rgb(214, 209, 69)', textColor: 'black'},
        { id: '6', title: 'Event 6', start: '2025-02-09T08:00:00', end: '2025-02-11T20:00:00', resourceId: 'g', color: '#BFF2F4', hoverColor: '#8FEDF4', clickColor: 'rgb(52, 200, 224)', textColor: 'black'},
        { id: '7', title: 'Event 7', start: '2025-02-21T00:00:00', end: '2025-02-27T00:00:00', resourceId: 'g', color: '#C3F1F4', hoverColor: '#8FEDF4', clickColor: 'rgb(52, 200, 224)', textColor: 'black'},
        { id: '8', title: 'Event 8', start: '2025-02-24T00:00:00', end: '2025-02-27T00:00:00', resourceId: 'j', color: '#FDE6C2', hoverColor: '#FFB68C', clickColor: 'rgb(226, 150, 30)', textColor: 'black'},
        { id: '9', title: 'Event 9', start: '2025-02-19T00:00:00', end: '2025-02-22T00:00:00', resourceId: 'l', color: '#FFCBD0', hoverColor: '#D77E88', clickColor: 'rgb(175, 0, 0)', textColor: 'black'},
        { id: '10', title: 'Event 10', start: '2025-02-07T00:00:00', end: '2025-02-12T00:00:00', resourceId: 'o', color: '#D0F0C0', hoverColor: '#A6F08D', clickColor: 'rgb(76,175, 0)', textColor: 'black'},
    ]);

    const getStoredResources = () => {
        const storedResources = localStorage.getItem('resources');
        return storedResources ? JSON.parse(storedResources) : [
            { id: 'a', title: 'Resource A' },
            { id: 'b', title: 'Resource B' },
            { id: 'c', title: 'Resource C' },
            { id: 'd', title: 'Resource D' },
            { id: 'e', title: 'Resource E' },
            { id: 'f', title: 'Resource F' },
            { id: 'g', title: 'Resource G' },
            { id: 'h', title: 'Resource H' },
            { id: 'i', title: 'Resource I' },
            { id: 'j', title: 'Resource J' },
            { id: 'k', title: 'Resource K' },
            { id: 'l', title: 'Resource L' },
            { id: 'm', title: 'Resource M' },
            { id: 'n', title: 'Resource N' },
            { id: 'o', title: 'Resource O' },
        ]
    };

    const [newEvent, setNewEvent ] = useState({ title: '', color: '#000000', resourceId: '', startDateTime: '', endDateTime: '' });
    const [currentMonth, setCurrentMonth] = useState('');
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [resources, setResources] = useState(getStoredResources);
    useEffect(() => {
        localStorage.setItem('resources', JSON.stringify(resources));
    },[resources]);

    const highlightToday = (arg) => {
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-CA');
        const cellDate = arg.date.toLocaleDateString('en-CA');
        if (cellDate === todayStr) {
            arg.el.style.backgroundColor = '#007aff';
            arg.el.style.color = 'White';
            arg.el.style.borderRadius = '18px';
            arg.el.style.padding = '1px 6px';
            arg.el.style.transform = 'scale(0.8)';
            arg.el.style.fonrSize= '18px';
            arg.el.style.transformOrigpxin = 'center';
        }
    };

    useEffect(() => {
        updateMonthName();
    },[]);

    const updateMonthName = () => {
        const calendarApi = calendarRef.current.getApi();
        const currentDate = calendarApi.getDate();
        const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        setCurrentMonth(monthName);
    };

    const openModal = (arg) => {
        setNewEvent({ ...newEvent, startDateTime: arg.startStr, endDateTime: arg.endStr, resourceId: arg.resource.id });
        setModalIsOpen(true);
    };

    const handlePrevMonth = () => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.prev();
        updateMonthName();
    };

    const handleNextMonth = () => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.next();
        updateMonthName();
    };

    const handleToday = () => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.today();
        updateMonthName();
    };

    const handleDateChange = (date) => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.goDate(date);
        updateMonthName();
        setDatePickerOpen(false);
    };

    //Delete an Event 

    const handleEventClick = (info) => {
        setSelectedEventId(info.event.id);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Delete" && selectedEventId) {
            deleteEvent(selectedEventId);
            setSelectedEventId(null);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    },[selectedEventId]);

    const deleteEvent = (eventId) => {
        setEvents((prevEvents) => {
            const updatedEvents = prevEvents.filter(event => event.id !== eventId);
            toast.success('Event deleted successfully!');
            return updatedEvents;
        });
    };

    //Add a New Resources
    const addResource = (resourceName) => {
        if (!resourceName) return;

        const newResourceId = `res-${String.fromCharCode(65 + resources.length)}`;
        const newResource = { id : newResourceId, title: resourceName };

        setResources([...resources, newResource]);
        toast.success(`Added ${newResource.title}`);
    };

    const eventColors = [
        { resourceId: 'a', color: "#FFA0A0", hoverColor: "#FF7675", clickColor: "rgb(226, 0, 0)" },
        { resourceId: 'b', color: "#C1F2C9", hoverColor: "#9DF2A1", clickColor: "rgb(29, 171, 47)" },
        { resourceId: 'c', color: "#C8CBE6", hoverColor: "#ACC3E6", clickColor: "rgb(73, 129, 214)" },
        { resourceId: 'd', color: "#FEB0FF", hoverColor: "#FF96FA", clickColor: "rgb(226, 93, 210)" },
        { resourceId: 'e', color: "#C1F2C9", hoverColor: "#9DF2A1", clickColor: "rgb(29, 171, 47)" },
        { resourceId: 'f', color: "#F7FCC4", hoverColor: "#F9FC94", clickColor: "rgb(214, 209, 69)" },
        { resourceId: 'g', color: "#BFF2F4", hoverColor: "#8FEDF4", clickColor: "rgb(52, 200, 224)" },
        { resourceId: 'g', color: "#C3F1F4", hoverColor: "#8FEDF4", clickColor: "rgb(52, 200, 224)" },
        { resourceId: 'h', color: "#D0F0C0", hoverColor: "#A6F08D", clickColor: "rgb(76, 175, 0)" },
        { resourceId: 'i', color: "#29CFCF", hoverColor: "#22ABAB", clickColor: "rgb(22, 111, 111)" },
        { resourceId: 'j', color: "#FDE6C2", hoverColor: "#FFB68C", clickColor: "rgb(247, 150, 30)" },
        { resourceId: 'k', color: "#BFF2F4", hoverColor: "#8FEDF4", clickColor: "rgb(52, 200, 224)" },
        { resourceId: 'l', color: "#FFCBD0", hoverColor: "#D77E88", clickColor: "rgb(175, 0, 0)" },
        { resourceId: 'm', color: "#8FA977", hoverColor: "#698C49", clickColor: "rgb(68, 111, 28)" },
        { resourceId: 'n', color: "#117788", hoverColor: "#0F6776", clickColor: "rgb(7, 49, 56)" },
        { resourceId: 'o', color: "#D0F0C0", hoverColor: "#A6F08D", clickColor: "rgb(76, 175, 0)" },
    ];

    const handleEventResize = (info) => {
        const updatedEvent = info.event;

        setEvents((prevEvents) => 
            prevEvents.map((event) => 
                event.id === updatedEvent.id
                ? { ...event, start: updatedEvent.start.toISOString(), end: updatedEvent.end.toISOString() }
                : event
            )
            );
            toast.success('Event resizd successfully!');
        };

        const handleEventDrop = (info) => {
            const { event } = info;

            setEvents((prevEvents) =>
            prevEvents.map((evt) =>
                evt.id === event.id
            ? {
                ...evt,
                start: event.start.toISOString(),
                end: event.end ? event.end.toISOString() : event.start.toISOString(),
                resourceId: event.getResources()[0]?.id  || evt.resourceId,
            }
            : evt
            )
        );
        toast.success(`Event "${event.title}" moved successfully!`);
        };

        const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

        const handleEventMouseEnter = (info) => {
            setTooltip({
                visible: true,
                content: `${info.event.title}\nStart: ${info.event.start.toLocaleString()}\nEnd: ${info.event.end.toLocaleString()}`,
                x: info.jsEvent.clientX + 10,
                y: info.jsEvent.clientY + 10,
            });
        };
        const handleEventMouseLeave = () => {
            setTooltip({ visible: false, content: '', x: 0, y: 0 });
        };

        const handleDeleteResource = (resourceId) => {
            setResources((prevResources) => 
            prevResources.filter((res) => res.id !== resourceId)
            );
            toast.success('Resource deleted successfully!');
        };

        return (
            <div className="App p-14">
                <div className="mb-4 flex justify-between items-center">
                    {/*Left Section */}
                    <div>
                        <h1 className="text-2xl font-bold cursor-pointer" style={{ color: "#007aff" }} onClick={() => setDatePickerOpen(!datePickerOpen)}>
                            {currentMonth}
                        </h1>
                        {datePickerOpen && (
                            <div style={{ position: 'absolute', zIndex: '4' }}>
                                <DatePicker
                                selected={new Date()}
                                onChange={handleDateChange}
                                inline
                                />
                            </div>
                        )}
                    </div>
                    {/*Buttons: Add Resource & Delete */}
                    <div className="flex items-center">
                        <button className="py-2 px-4 bg-blue-500 text-white rounded m-0 mr-[-300px]" onClick={() => addResource(prompt('Enter resource name: '))}>
                            Add Resource
                        </button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="delete-btn bg-blue-500 px-4 py-2 m-0 ml-[-300px]">
                        Delete
                    </button>
                    {/*Delete the Resources Modal */}
                    <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    portalClassName="modal-portal"
                    >
                        <h2 className="ml-60">Select a Resource to delete</h2>
                        <ul>
                            {resources.map((resource) => (
                                <li key={resource.id} className="resource-item ml-60">
                                    {resource.title}
                                    <button onClick={() => handleDeleteResource(resource.id)} className="delete-resource-btn bg-blue-500 py-1 px-3"
                                        > 
                                    🗑
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setIsModalOpen(false)} className="close-btn bg-blue-500">
                            Close
                        </button>
                    </Modal>
                    <div>
                    {/* Navigation Buttons */}
                    <button onClick={handlePrevMonth} className="text-2xl py-2 bg-white hover:bg-white text-blue-500 rounded hover:text-blue-400 ">{'<'}</button>
                    <button onClick={handleToday} className="text-2xl py-2 bg-white hover:bg-white text-blue-500 rounded hover:text-blue-400 ">Today</button>
                    <button onClick={handleNextMonth} className="text-2xl py-2 bg-white hover:bg-white text-blue-500 rounded hover:text-blue-400 ">{'>'}</button>
                </div>
            </div>

            <FullCalendar
            ref={calendarRef}
            plugins={[resourceTimelinePlugin, interactionPlugin]}
            initialView="resourceTimelineMonth"
            editable={true}
            droppable={true}
            selectable={true}
            events={events}
            eventResize={handleEventResize}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventDurationEditable={true}
            eventResizableFromStart={true}
            slotLabelDidMount={highlightToday}
            resources={resources}
            eventMouseEnter={handleEventMouseEnter}
            eventMouseLeave={handleEventMouseLeave}
            select={(arg) => openModal(arg)}
            headerToolbar={false}
            slotDuration="24:00:00"
            slotLabelFormat={{
                weekday: 'short',
                day: 'numeric',
                omitZeroMinute: false
            }}
            resourceAreaWidth="15%"
            contentHeight="auto"
            aspectRatio={2}
            scrollTime="00:00:00"

            eventContent={(arg) => (
                <div>
                <b>{arg.event.title}</b>
                <br />
                {new Date(arg.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})} -
                {new Date(arg.event.end).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit'})}
                </div>
            )}
            
            dateClick={(info) => {
                const clickedResourceId = info.resource?.id;
                const resourceColorSettings = eventColors.find(event => event.resourceId === clickedResourceId);

                if (resourceColorSettings) {
                    const newEvent = {
                        id: String(events.length + 1),
                        title: `New Event`,
                        start: info.dateStr,
                        end: new Date(new Date(info.dateStr).getTime() + 24 * 60 * 60 *1000).toISOString(),
                        resourceId: resourceColorSettings.resourceId,
                        color: resourceColorSettings.color,
                        hoverColor: resourceColorSettings.hoverColor,
                        clickColor: resourceColorSettings.clickColor,
                        textColor: "black",
                        className: 'new-event',
                        draggable: true,
                    };
                    setEvents(prevEvents => [...prevEvents, newEvent])
                }
            }}

            eventDidMount={(info) => {
                const originalColor = info.event.extendedProps.color;
                const hoverColor = info.event.extendedProps.hoverColor;
                const clickColor = info.event.extendedProps.clickColor || originalColor;
                const textColor = info.event.extendedProps.textColor;
                let isClicked = false;

                info.el.style.backgroundColor = originalColor;
                info.el.style.color = textColor;

                info.el.addEventListener(
                    "mouseenter", () => {
                        if (!isClicked) {
                            info.el.style.backgroundColor = hoverColor;
                        }
                    },
                    {passive: true}
                );

                info.el.addEventListener(
                    "mouseleave",() => {
                        if (!isClicked) {
                            info.el.style.backgroundColor = originalColor;
                        }
                    },
                    {passive: true}
                );
                info.el.addEventListener(
                    "click",() => {
                        isClicked = !isClicked;
                        info.el.style.backgroundColor = isClicked ? clickColor : originalColor;
                    }, {passive: true}
                );
            }}
            />
            {tooltip.visible && (
                <div style={{
                    position: 'absolute',
                    top: tooltip.y,
                    left: tooltip.x,
                    backgroundColor: '#393939',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    width: '230px'
                }}
                >
                {tooltip.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
                </div>
            )}
            <ToastContainer />
            </div>
        );
}

export default App;