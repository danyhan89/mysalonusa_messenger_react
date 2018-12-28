import React from "react";
import PropTypes from "prop-types";

import join from "@app/join";
import cleanupProps from "@app/cleanupProps";
import styles from "./index.scss";

class TabPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: props.defaultActiveIndex || 2
    };
  }

  render() {
    const { props } = this;

    const children = React.Children.toArray(props.children);

    const activeIndex = this.getActiveIndex();

    const titles = children.map(child => child.props.tabTitle);

    let activeTab = children[activeIndex];

    const ActiveTabType = activeTab.type;
    const activeTabProps = { ...activeTab.props };
    delete activeTabProps.tabTitle;
    delete activeTabProps.tabTitleClassName;

    activeTab = <ActiveTabType {...activeTabProps} />;

    return (
      <div
        {...cleanupProps(props, TabPanel.propTypes)}
        className={join(props.className, "flex flex-column", styles.tabPanel)}
      >
        <div className={props.tabStripClassName} style={props.tabStripStyle}>
          {titles
            .map((title, index) => {
              if (!title) {
                return null;
              }
              const active = index === activeIndex;
              const onClick = () => {
                this.setActiveIndex(index);
              };
              let titleClassName;
              if (typeof props.tabTitleClassName == "function") {
                titleClassName = props.tabTitleClassName(index);
              } else {
                titleClassName = props.tabTitleClassName;
              }
              return (
                <div
                  key={index}
                  onClick={onClick}
                  style={props.tabTitleStyle}
                  className={join(
                    active && styles.activeTab,
                    "dib",
                    props.defaultTabTitleClassName,
                    titleClassName
                  )}
                >
                  {title}
                </div>
              );
            })
            .filter(Boolean)}
        </div>
        <div
          style={props.tabBodyStyle}
          className={join(
            props.tabBodyClassName,
            "flex flex-column TabPanel__tabBody",
            styles.tabBody
          )}
        >
          {activeTab}
        </div>
      </div>
    );
  }

  setActiveIndex(index) {
    const uncontrolled = this.props.activeIndex === undefined;

    if (uncontrolled) {
      this.setState({
        activeIndex: index
      });
    }

    this.props.onActivate(index);
  }

  getActiveIndex() {
    const { props, state } = this;

    const activeIndex =
      props.activeIndex !== undefined ? props.activeIndex : state.activeIndex;

    return activeIndex;
  }
}

TabPanel.defaultProps = {
  onActivate: () => {},
  tabTitleStyle: {
    cursor: "pointer"
  },
  defaultTabTitleClassName: join("f5 pa2 ph3", styles.tab),
  tabStripClassName: join(styles.tabStrip),
  tabBodyClassName: ""
};

TabPanel.propTypes = {
  onActivate: PropTypes.func,

  defaultActiveIndex: PropTypes.number,
  activeIndex: PropTypes.number,

  tabTitleStyle: PropTypes.shape({}),
  tabBodyStyle: PropTypes.shape({}),
  tabStripStyle: PropTypes.shape({}),

  tabTitleClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
  defaultTabTitleClassName: PropTypes.string,
  tabStripClassName: PropTypes.string,
  tabBodyClassName: PropTypes.string
};
/*
<TabPanel activeIndex={1} onActivate={index => { }}>
  <div tabTitle={<b>t1</b>}>contents tab 1</div> // React.createElement('div', {tabTitle: ''}, 'contentes tab 1')
  <div tabTitle="t2">contents tab 2</div>
</TabPanel>
*/

export default TabPanel;
