// Immediately invoked function expression (IIFE) to encapsulate the code
!function() {
    "use strict";

    // Clocky component for the timer application
    class Clocky extends React.Component {
        constructor(props) {
            super(props);

            // Initial state of the timer and settings
            this.state = {
                breakLength: 5,
                sessionLength: 25,
                timerState: "stopped",
                timerType: "Session",
                timer: 1500, // 25 minutes in seconds
                intervalID: "", // To hold interval ID for countdown
                alarmColor: {
                    color: "white"
                }
            };

            // Binding this for methods
            this.setBreakLength = this.setBreakLength.bind(this);
            this.setSessionLength = this.setSessionLength.bind(this);
            this.lengthControl = this.lengthControl.bind(this);
            this.timerControl = this.timerControl.bind(this);
            this.beginCountDown = this.beginCountDown.bind(this);
            this.decrementTimer = this.decrementTimer.bind(this);
            this.phaseControl = this.phaseControl.bind(this);
            this.warning = this.warning.bind(this);
            this.buzzer = this.buzzer.bind(this);
            this.switchTimer = this.switchTimer.bind(this);
            this.clockify = this.clockify.bind(this);
            this.reset = this.reset.bind(this);
        }

        // Method to set break length
        setBreakLength(e) {
            this.lengthControl("breakLength", e.currentTarget.value, this.state.breakLength, "Session");
        }

        // Method to set session length
        setSessionLength(e) {
            this.lengthControl("sessionLength", e.currentTarget.value, this.state.sessionLength, "Break");
        }

        // Method to control length (session or break)
        lengthControl(e, t, s, i) {
            // Check if timer is not running before updating length
            if ("running" !== this.state.timerState) {
                if (this.state.timerType === i) {
                    if ("-" === t && s !== 1) {
                        this.setState({
                            [e]: s - 1
                        });
                    } else if ("+" === t && s !== 60) {
                        this.setState({
                            [e]: s + 1
                        });
                    }
                } else {
                    if ("-" === t && s !== 1) {
                        this.setState({
                            [e]: s - 1,
                            timer: 60 * s - 60 // Adjust timer if session/break length changes
                        });
                    } else if ("+" === t && s !== 60) {
                        this.setState({
                            [e]: s + 1,
                            timer: 60 * s + 60 // Adjust timer if session/break length changes
                        });
                    }
                }
            }
        }

        // Method to control timer (start/stop)
        timerControl() {
            if ("stopped" === this.state.timerState) {
                this.beginCountDown();
                this.setState({
                    timerState: "running"
                });
            } else {
                this.setState({
                    timerState: "stopped"
                });
                if (this.state.intervalID) {
                    clearInterval(this.state.intervalID); // Clear interval if timer is stopped
                }
            }
        }

        // Method to begin countdown
        beginCountDown() {
            let intervalID = setInterval(() => {
                this.decrementTimer();
                this.phaseControl();
            }, 1000); // Update timer every second

            // Store interval ID in state
            this.setState({
                intervalID: intervalID
            });
        }

        // Method to decrement timer
        decrementTimer() {
            this.setState({
                timer: this.state.timer - 1
            });
        }

        // Method to control timer phases (session/break)
        phaseControl() {
            let timer = this.state.timer;
            this.warning(timer); // Check for timer warning (less than 1 minute)
            this.buzzer(timer); // Activate buzzer when timer reaches 0
            if (timer < 0) {
                // Switch session to break or break to session
                if ("Session" === this.state.timerType) {
                    this.beginCountDown();
                    this.switchTimer(60 * this.state.breakLength, "Break");
                } else {
                    this.beginCountDown();
                    this.switchTimer(60 * this.state.sessionLength, "Session");
                }
            }
        }

        // Method to change alarm color based on remaining time
        warning(timer) {
            if (timer < 61) {
                this.setState({
                    alarmColor: {
                        color: "#a50d0d"
                    }
                });
            } else {
                this.setState({
                    alarmColor: {
                        color: "white"
                    }
                });
            }
        }

        // Method to play buzzer sound when timer reaches 0
        buzzer(timer) {
            if (timer === 0) {
                this.audioBeep.play(); // Play audio beep sound
            }
        }

        // Method to switch timer between session and break
        switchTimer(time, type) {
            this.setState({
                timer: time,
                timerType: type,
                alarmColor: {
                    color: "white"
                }
            });
        }

        // Method to format timer into mm:ss format
        clockify() {
            if (this.state.timer < 0) return "00:00"; // Return 00:00 if timer is less than 0
            let minutes = Math.floor(this.state.timer / 60);
            let seconds = this.state.timer - 60 * minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds; // Add leading zero to seconds if less than 10
            minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes if less than 10
            return minutes + ":" + seconds;
        }

        // Method to reset timer and settings to initial state
        reset() {
            this.setState({
                breakLength: 5,
                sessionLength: 25,
                timerState: "stopped",
                timerType: "Session",
                timer: 1500,
                intervalID: "",
                alarmColor: {
                    color: "white"
                }
            });

            if (this.state.intervalID) {
                clearInterval(this.state.intervalID); // Clear interval if timer is running
            }

            this.audioBeep.pause(); // Pause audio beep sound
            this.audioBeep.currentTime = 0; // Reset audio beep to start
        }

        // Render method to display UI components
        render() {
            return (
                <div>

                    {/* Main title of the application */}
                    <div className="main-title">25 + 5 Clock</div>

                    {/* Component for controlling break length */}
                    <ButtonTemplate
                        title="Break Length"
                        titleID="break-label"
                        length={this.state.breakLength}
                        lengthID="break-length"
                        addID="break-increment"
                        decID="break-decrement"
                        onClick={this.setBreakLength}
                    />

                    {/* Component for controlling session length */}
                    <ButtonTemplate
                        title="Session Length"
                        titleID="session-label"
                        length={this.state.sessionLength}
                        lengthID="session-length"
                        addID="session-increment"
                        decID="session-decrement"
                        onClick={this.setSessionLength}
                    />

                    {/* Timer display */}
                    <div className="timer" style={this.state.alarmColor}>
                        <div className="timer-wrapper">
                            <div id="timer-label">{this.state.timerType}</div>
                            <div id="time-left">{this.clockify()}</div>
                        </div>
                    </div>

                    {/* Timer control buttons */}
                    <div className="timer-control">
                        <button id="start" onClick={this.timerControl}><i className="fa fa-play fa-2x"></i></button>
                        <button id="stop" onClick={this.timerControl}><i className="fa fa-pause fa-2x"></i></button>
                        <button id="reset" onClick={this.reset}><i className="fa fa-refresh fa-2x"></i></button>
                    </div>

                    {/* Author information */}
                    <div className="author">
                        Designed and Coded by <br />
                        <a href="" target="_blank">Rapulu</a>
                    </div>

                    {/* Audio element for beep sound */}
                    <audio id="beep" preload="auto" ref={(e) => { this.audioBeep = e; }} src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
                </div>
            );
        }
    }

    // Component for reusable button template
    class ButtonTemplate extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                titleID: "",
                title: "",
                lengthID: "",
                decID: "",
                addID: "",
                onClick: ""
            };
        }

        render() {
            return (
                <div className="length-control panel">
                    <div id={this.props.titleID}>{this.props.title}</div>
                    <button className="btn-level" id={this.props.decID} value="-" onClick={this.props.onClick}>
                        <i className="fa fa-arrow-down fa-2x"></i>
                    </button>
                    <div className="btn-level" id={this.props.lengthID}>{this.props.length}</div>
                    <button className="btn-level" id={this.props.addID} value="+" onClick={this.props.onClick}>
                        <i className="fa fa-arrow-up fa-2x"></i>
                    </button>
                </div>
            );
        }
    }

    // Render Clocky component inside the #app element
    ReactDOM.createRoot(document.getElementById("app")).render(<Clocky />);
}();
