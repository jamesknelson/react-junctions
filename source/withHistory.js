/**

This Component is based on the withRouter component from react-router:
https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/withRouter.js

The MIT License (MIT)

Copyright (c) 2015-present, Ryan Florence, Michael Jackson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

import React, { PropTypes } from 'react';

const withHistory = (Component) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class C extends React.Component {
    static contextTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired,
    };

    render() {
      const history = this.context.history;
      const historyProps = { history };

      return (
        <Component {...this.props} {...historyProps} />
      );
    }
  }

  C.displayName = `withHistory(${Component.displayName || Component.name})`;

  return C;
};

export default withHistory;
