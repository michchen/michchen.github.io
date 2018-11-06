import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timer: 10,
        }
        
        this.timer = this.timer.bind(this);
    };
    
    timer () {
        setTimeout(() => {
            this.setState({
                timer: this.state.timer - 1
            })
            if (this.state.timer) { 
                this.timer(); 
            }
        }, 1000);
    };

    componentDidMount(){
        if (this.state.timer) {
            this.timer();
        }
    }

    render(){
        const { timer } = this.state;
        if (timer === 0) {
            this.props.handleEndGame();
        }
        return (
            <div>{ timer }</div>
        )
    }
}
export default Timer;


