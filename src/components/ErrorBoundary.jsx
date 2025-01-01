// src/components/ErrorBoundary.jsx
import React from 'react';
import ErrorModal from './ErrorModal'; // Create this component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }
     componentDidCatch(error, errorInfo) {
          this.setState({errorInfo});
        }

    handleClose = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    }


    render() {
        if (this.state.hasError) {
            return <ErrorModal open={this.state.hasError} handleClose={this.handleClose} error={this.state.error} errorInfo={this.state.errorInfo} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;