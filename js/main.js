/**
*	Shut The Box top level container
*/
var ShutTheBox = React.createClass({
	render: function () {
		return (
			<div className="shut-the-box-container">
				<Box diceResult={this.props.diceres} />
				<DiceBox />
			</div>
		);
	}
});
/**
*	The Box component is responsible of rendering all the number tiles
*/
var Box = React.createClass({

	getInitialState: function () {
		var tiles = [];

		for (var i = 1; i <= 9; i++) {
				tiles.push( { number: i,
											"chosen": false,
											"disabled": false }
									);
		}

		return { tiles: tiles }
	},

	render: function () {
		var tiles = this.state.tiles.map(function (value, key) {
			return <Tile status={value.chosen} number={value.number} key={key} />
		});

		return (
			<ul>{tiles}</ul>
		);
	}


	//if 7,8 or 9 is still on the table must roll both dice
	//else player can roll one die or two dice
	//keep rolling dice until no boxes can be shut
	//need to count the uncovered numbers from the boxes

});

/**
*	Creates the DOM representation of a tile that lives inside the box
*/
var Tile = React.createClass({

	getInitialState: function () {
		return { chosen: this.props.chosen };
	},

	render: function () {
		var chosenClassName = this.state.chosen ? "chosen" : "";

		return (
			<li className={chosenClassName + " tile"}  onClick={this.onTileClick}>{this.props.number}</li>
		);
	},

	onTileClick: function (e) {
		//todo: push current clicked tile to a numbers data structure...
		console.log(this.props.diceres)

		this.setState({ chosen: !this.state.chosen });
	}

});


var DiceBox = React.createClass({
	getInitialState: function () {
		return {
			currentDiceNum: [6,6]
		}
	},
	render: function () {
		return (
			<div id="dice-container" className="dice-container">
				<div className="dice">
					{this.state.currentDiceNum[0]}
				</div>

				<div className="dice">
					{this.state.currentDiceNum[1]}
				</div>

				<button onClick={this.rollDice}>Roll Dice</button>
			</div>
		);
	},
	rollDice: function () {
		var dice1 = Math.floor(Math.random()*6),
				dice2 = Math.floor(Math.random()*6);

		this.setState({ currentDiceNum: [dice1, dice2] });

		this.props.diceResult = dice1 + dice2;
	}
});

React.render(<ShutTheBox diceres={0} />,
	document.getElementsByTagName('body')[0]
);
