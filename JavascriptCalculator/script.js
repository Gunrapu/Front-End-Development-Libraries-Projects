// Regular expressions to identify operators and specific patterns
const isOperator = /[x/+-]/;
const endWithOperator = /[x+-]$/;
const endWithNegativeSign = /\d[x/+-]{1}-$/;

// Styles for different button states
const clearStyle = {
  backgroundColor: "#575757"
};

const operatorStyle = {
  backgroundColor: "#6b6b6b",
};

const equalStyle = {
  backgroundColor: "#575757",
  position: "absolute",
  height: 65,
  bottom: 5
};

// Calculator component
class Calculator extends React.Component {
  constructor(props) {
    super(props);

    // Initial state setup
    this.state = {
      currentNum: "0",
      prevNum: "0",
      formula: "",
      evaluated: false // Flag to track if the formula has been evaluated
    };

    // Binding functions to this context
    this.initialize = this.initialize.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
  }

  // Function to reset calculator state
  initialize() {
    this.setState({
      currentNum: "0",
      prevNum: "0",
      formula: "",
      evaluated: false
    });
  }

  // Function to handle operator clicks
  handleOperators(e) {
    const operator = e.target.value;
    const { formula, prevNum, evaluated } = this.state;

    // Update state based on operator clicks
    if (!this.state.currentNum.includes("Limit")) {
      this.setState({
        currentNum: operator,
        evaluated: false
      });

      if (evaluated) {
        // If already evaluated, start with the previous number and the new operator
        this.setState({
          formula: prevNum + operator,
          prevNum: this.state.currentNum
        });
      } else {
        // Handle different scenarios for appending operators to the formula
        if (endWithOperator.test(formula)) {
          if (endWithNegativeSign.test(formula)) {
            // Handle scenarios where a negative sign is appended
            if (operator !== "-") {
              this.setState({
                formula: prevNum + operator,
                prevNum: this.state.currentNum
              });
            }
          } else {
            // Handle appending regular operators
            this.setState({
              formula: (endWithNegativeSign.test(formula + operator) ? formula : prevNum) + operator,
              prevNum: this.state.currentNum
            });
          }
        } else {
          // Append operator to the formula
          this.setState({
            prevNum: this.state.currentNum,
            formula: formula + operator
          });
        }
      }
    }
  }

  // Function to handle evaluation of the formula
  handleEvaluate() {
    if (!this.state.currentNum.includes("Limit")) {
      let expression = this.state.formula;

      // Remove trailing operators before evaluation
      while (endWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }

      // Replace 'x' with '*' and '--' with '+' for safe evaluation
      expression = expression.replace(/x/g, "*").replace(/--/g, "+");

      // Evaluate the expression
      let answer = Math.round(1e12 * eval(expression)) / 1e12;

      // Update state with evaluated result
      this.setState({
        currentNum: answer.toString(),
        formula: expression + "=" + answer,
        prevNum: this.state.currentNum,
        evaluated: true
      });
    }
  }

  // Function to handle number button clicks
  handleNumbers(e) {
    const { currentNum, formula, evaluated } = this.state;
    const num = e.target.value;

    if (!currentNum.includes("Limit")) {
      this.setState({
        evaluated: false
      });

      if (evaluated) {
        // Reset after evaluation
        this.setState({
          currentNum: num,
          formula: num !== "0" ? num : ""
        });
      } else {
        // Append number to the current number or formula
        this.setState({
          currentNum: currentNum === "0" || isOperator.test(currentNum) ? num : currentNum + num,
          formula: currentNum === "0" && num === "0" ? "" : formula + num
        });
      }
    }
  }

  // Function to handle decimal button click
  handleDecimal() {
    if (this.state.evaluated) {
      // Reset after evaluation
      this.setState({
        currentNum: "0.",
        formula: "0.",
        evaluated: false
      });
    } else if (!this.state.currentNum.includes(".") && !this.state.currentNum.includes("Limit")) {
      this.setState({
        evaluated: false
      });

      if (this.state.currentNum.length > 21) {
        // Limit reached warning
        this.maxDigitWarning();
      } else {
        // Append decimal to current number or formula
        if (endWithOperator.test(this.state.formula) || (this.state.currentNum === "0" && this.state.formula === "")) {
          this.setState({
            currentNum: "0.",
            formula: this.state.formula + "0."
          });
        } else {
          this.setState({
            currentNum: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
            formula: this.state.formula + "."
          });
        }
      }
    }
  }

  // Function to handle delete button click
  handleDelete() {
    if (this.state.prevNum.length > 0) {
      // Remove last character from currentNum, prevNum, and formula
      const newCurrentNum = this.state.currentNum.slice(0, -1);
      const newPrevNum = this.state.prevNum.slice(0, -1);
      this.setState({
        currentNum: newCurrentNum,
        prevNum: newPrevNum,
        formula: this.state.formula.replace(/.$/, '')
      });
    } else {
      // Remove last character from currentNum and formula
      const newCurrentNum = this.state.currentNum.slice(0, -1);
      this.setState({
        currentNum: newCurrentNum,
        prevNum: newCurrentNum,
        formula: this.state.formula.replace(/.$/, '')
      });
    }
  }

  // Function to handle maximum digit limit warning
  maxDigitWarning() {
    this.setState({
      currentNum: "Limit Digit Number",
      prevNum: this.state.currentNum
    });

    // Reset currentNum after 2 seconds
    setTimeout(() => this.setState({
      currentNum: this.state.prevNum
    }), 2000);
  }

  // Render method to display the calculator
  render() {
    return (
      <div>
        <div className="calculator">
          <Formula formula={this.state.formula.replace(/x/g, ".")} />
          <Output currentNumber={this.state.currentNum} />
          <Buttons
            decimal={this.handleDecimal}
            evaluate={this.handleEvaluate}
            initialize={this.initialize}
            numbers={this.handleNumbers}
            operators={this.handleOperators}
            delete={this.handleDelete}
          />
        </div>
        <div className="author">
          {" "}
          Code By Gun <br />
          <a href="" target="_blank">
            GunPu
          </a>
        </div>
      </div>
    );
  }
}

// Formula component to display the formula
class Formula extends React.Component {
  render() {
    return <div className="formulaScreen">{this.props.formula}</div>;
  }
}

// Output component to display the current number
class Output extends React.Component {
  render() {
    return (
      <div className="outputScreen" id="display">
        {this.props.currentNumber}
      </div>
    );
  }
}

// Buttons component to handle calculator buttons
class Buttons extends React.Component {
  render() {
    return (
      <div>
        {/* Calculator buttons */}
        <button className="styleBtn" id="clear" style={clearStyle} value="Clear" onClick={this.props.initialize}>
          CLEAR
        </button>
        <button id="divide" style={operatorStyle} value="/" onClick={this.props.operators}>
          /
        </button>
        <button id="multiply" style={operatorStyle} value="x" onClick={this.props.operators}>
          x
        </button>
        <button id="seven" onClick={this.props.numbers} value="7">
          7
        </button>
        <button id="eight" onClick={this.props.numbers} value="8">
          8
        </button>
        <button id="nine" onClick={this.props.numbers} value="9">
          9
        </button>
        <button id="subtract" style={operatorStyle} value="-" onClick={this.props.operators}>
          -
        </button>
        <button id="four" onClick={this.props.numbers} value="4">
          4
        </button>
        <button id="five" onClick={this.props.numbers} value="5">
          5
        </button>
        <button id="six" onClick={this.props.numbers} value="6">
          6
        </button>
        <button id="add" style={operatorStyle} value="+" onClick={this.props.operators}>
          +
        </button>
        <button id="one" onClick={this.props.numbers} value="1">
          1
        </button>
        <button id="two" onClick={this.props.numbers} value="2">
          2
        </button>
        <button id="three" onClick={this.props.numbers} value="3">
          3
        </button>
        <button id="del" value="Del" onClick={this.props.delete}>
          {"<"}
        </button>
        <button className="styleBtn" id="zero" onClick={this.props.numbers} value="0">
          0
        </button>
        <button id="decimal" onClick={this.props.decimal} value=".">
          .
        </button>
        <button id="equals" style={equalStyle} value="=" onClick={this.props.evaluate}>
          =
        </button>
      </div>
    );
  }
}

// Rendering the Calculator component to the app element
ReactDOM.render(<Calculator />, document.getElementById("app"));
