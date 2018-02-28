import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'

import join from '@app/join'
import cleanupProps from '@app/cleanupProps'
import styles from './index.scss'

class Accordion extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsedTabs: {}
    }

    this.toggleTab = this.toggleTab.bind(this)
  }

  toggleTab(index) {
    let { collapsedTabs } = this.state

    collapsedTabs = { ...collapsedTabs }
    if (collapsedTabs[index]) {
      delete collapsedTabs[index]
    } else {
      collapsedTabs[index] = true
    }

    this.setState({
      collapsedTabs
    })
  }

  render() {
    const { props } = this

    const tabs = React.Children.toArray(props.children)

    const children = tabs.map((tab, index) => {
      const tabTitle = tab.props.tabTitle
      const TabType = tab.type
      const tabProps = { ...tab.props }
      delete tabProps.tabTitle

      const onClick = () => {
        this.toggleTab(index)
      }
      const collapsed = this.state.collapsedTabs[index]
      const last = index === tabs.length - 1

      return [
        <div onClick={onClick} key={index + 'tabtitle'} className={`${styles.accordionTab} ${last ? styles.last : ''} ${collapsed ? styles.collapsed : styles.expanded} flex flex-row pa2`}>
          <div className={styles.tabTitle}>{tabTitle}</div> <div className={styles.hint}>click to {collapsed ? 'expand' : 'collapse'}</div>
        </div>,
        collapsed ? null : <TabType key={index} {...tabProps} />
      ]
    })

    // const ActiveTabType = activeTab.type
    //const activeTabProps = { ...activeTab.props }
    //delete activeTabProps.tabTitle

    return <div {...cleanupProps(props, Accordion.propTypes)} className={join(props.className, styles.Accordion)} >
      {children}
    </div>

  }
}

Accordion.defaultProps = {

}

Accordion.propTypes = {

}

export default Accordion