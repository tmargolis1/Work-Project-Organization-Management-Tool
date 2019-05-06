import React from 'react'

class UsernameForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username:''
        }
       
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){ 
        this.setState({
            username: e.target.value,
        })
   

    }

    onSubmit(e){
        e.preventDefault()
        this.props.onSubmit(this.state.username)
    }
//create control component
    render(){
        const styles = {
            container: {
              padding: 20,
              borderTop: '1px #4C758F solid',
              marginBottom: 20,
              backgroundColor: '#3e99b2',
            },
            form: {
              display: 'flex',
            },
            input: {
              color: 'inherit',
              background: 'none',
              outline: 'none',
              border: 'none',
               flex: 1,
              fontSize: 16,
            },
          }
        return(
            <div style={styles.container}>
                <h2>Username Form</h2>
                <form onSubmit={this.onSubmit} style={styles.form}>
                <input
                type='text'
                placeholder='What is your username?'
                onChange={this.onChange}
                />
                <input type='submit'/>
                </form>
                </div>
        )
    }
}

export default UsernameForm