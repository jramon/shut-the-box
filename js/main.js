/**
*	Shut The Box top level container
*/
var ShutTheBox = React.createClass({
	getInitialState: function () {
		return {
			diceResult: 0,
			isDiceDisabled: false
		}
	},
	onDiceRolled: function (diceResult) {
		this.setState({ diceResult: diceResult });
	},
	onDisableDice: function (isDisabled) {
		this.setState({ isDiceDisabled: isDisabled });
	},
	render: function () {
		return (
			<div className="shut-the-box-container">
				<Box diceResult={this.state.diceResult} onDisableDice={this.onDisableDice} />
				<Dice onDiceRolled={this.onDiceRolled}  isDiceDisabled={this.state.isDiceDisabled} />
			</div>
		);
	}
});
/**
*	The Box component is responsible of rendering all the number tiles
*/
var Box = React.createClass({
	getInitialState: function () {
		return { sum: 0, canEndTurn: false, tilesShut: [] };
	},
	sumAndValidate: function () {
			// if this is a valid tile combination...
			if (this.state.sum > 0 && this.state.sum <= this.props.diceResult)																																															 {
				//can end Turn
				this.setState({ canEndTurn: true }); //this is wrong according to the React way...
			} else {
				this.setState({ canEndTurn: false });
				//check player can continue playing...
			}
	},
	onEndTurn: function () {
		this.render();
		//I have disable the previously chosen tiles for good, but I don't have those numbers available here :/
	},
	render: function () {
		//should this return a new props object?
		this.sumAndValidate();

		var tiles = [];

		for (var i = 1; i <= 9; i++) {

			var shouldTileBeDisabled =  this.state.tilesShut.indexOf(i) > -1 ? true : false

			var props = { key: "tile-" + i,
										number: i,
										onDisableDice: this.props.onDisableDice,
										isShut: this.state.tilesShut.indexOf(i) > -1 ? true : false
									};

			if (!shouldTileBeDisabled) {
				props.onTileClick = this.onTileClick;
			}

			tiles.push(<Tile {...props} />);
		}

		return (
			<div>
				<h2>{this.props.diceResult}</h2>
				<h2>{this.state.sum}</h2>
				<ul className="dice-list">{tiles}</ul>
				<button disabled={this.state.canEndTurn ? '' : 'disabled'} onClick={this.onEndTurn}>End Turn</button>
			</div>
		);
	},
	/**
	*
	*/
	onTileClick: function (num) {
		var tilesShut = this.state.tilesShut,
				targetIndex = this.state.tilesShut.indexOf(Math.abs(num));
		//if not yet in tilesShut state
		if (targetIndex === -1) {
			tilesShut.push(num);
		} else {
			//meaning tile was open back up
			tilesShut.splice(targetIndex, 1);
		}

		this.setState({ sum: this.state.sum + num, tilesShut: tilesShut});
	}

});

/**
*	Creates the DOM representation of a tile inside the Box
*/
var Tile = React.createClass({

	getInitialState: function () {
		return { chosen: false }
	},

	render: function () {
		var tileClassNames = ['tile'];

		if (this.state.chosen) {
			tileClassNames.push('chosen');
		}

		if (this.props.isShut) {
			tileClassNames.push('disabled');
		}

		return <li className={tileClassNames.join(' ')} onClick={this.onTileClick}>{this.props.number}</li>
	},

	onTileClick: function (e) {
		var isChosen = !this.state.chosen;

		this.setState({ chosen: isChosen });

		if (isChosen) { //meaning we chose a new number
			this.props.onTileClick(this.props.number);
		} else {
			//if it was previously chosen, substract its value
			this.props.onTileClick(-this.props.number);
		}
	}


});

var Dice = React.createClass({
	getInitialState: function () {
		return {
			dice: [{value: 6, disabled: false }, {value: 6, disabled: false }],
			isRollingDisabled: true
		}
	},

	render: function () {
		var disabledClass = this.state.dice[1].disabled ? 'disabled' : 	'';

		return (
			<div id="dice-container" className="dice-container">
				<div className="dice">
					{this.state.dice[0].value}
				</div>

				<div className={"dice " + disabledClass}>
					{this.state.dice[1].value}
				</div>

				<button onClick={this.rollDice} disabled={!this.state.isRollingDisabled ? 'disabled' : ''}>Roll Dice</button>
			</div>
		);
	},

	rollDice: function () {
		var dice1 = Math.floor(1 + Math.random()*6),
				dice2 = Math.floor(1 + Math.random()*6);

		this.setState({
				currentDiceNum: [dice1, dice2]
		});

		this.props.onDiceRolled(dice1 + dice2);

		//disable roll dice button
		this.setState({ isRollingDisabled: false })
	}
});

React.render(<ShutTheBox diceres={0} />,
	document.getElementsByTagName('body')[0]
);
