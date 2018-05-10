import React from 'react';
import PropTypes from 'prop-types';

const editTypes = {
  floating: 'floating',
  flyout: 'flyout',
  inline: 'inlin',
  webcontrol: 'webcontrol'
};

class OnPageEditing extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    editType: PropTypes.oneOf(
      Object.keys(editTypes).map(key => editTypes[key])
    ),
    element: PropTypes.string,
    name: PropTypes.string
  };

  render() {
    if (this.props.name) {
      return React.createElement(
        this.props.element || 'div',
        {
          'data-epi-property-name': this.props.name,
          'data-epi-use-mvc': 'True',
          'data-epi-property-edittype': this.props.editType
        },
        this.props.children
      );
    }

    return this.props.children || null;
  }
}

OnPageEditing.editTypes = editTypes;

export default OnPageEditing;
