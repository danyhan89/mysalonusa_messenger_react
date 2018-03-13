import React from "react";
import PropTypes from "prop-types";

import join from "@app/join";

import styles from "./index.scss";

import FirstIcon from "./firstIcon";
import NextIcon from "./nextIcon";
import PrevIcon from "./prevIcon";
import LastIcon from "./lastIcon";

class PaginationToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.gotoNextPage = this.gotoNextPage.bind(this);
    this.gotoPrevPage = this.gotoPrevPage.bind(this);
  }

  gotoPrevPage() {
    this.gotoPage(this.getCurrentPage() - 1);
  }

  gotoNextPage() {
    this.gotoPage(this.getCurrentPage() + 1);
  }

  gotoPage(page) {
    if (page < 1 || page > this.getMaxPage()) {
      return;
    }
    const { limit } = this.props;

    const skip = (page - 1) * limit;

    this.props.onPageChange(page);
    this.props.onSkipChange(skip);
  }

  getMaxPage() {
    const { totalCount, limit, skip } = this.props;

    const pages = Math.ceil(totalCount / limit);

    return pages;
  }

  getCurrentPage() {
    const { totalCount, limit, skip } = this.props;

    const pages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    return currentPage;
  }
  hasNextPage(page) {
    const currentPage = this.getCurrentPage();
    const { totalCount, limit } = this.props;

    const pages = Math.ceil(totalCount / limit);
    const hasNextPage = currentPage < pages;

    return hasNextPage;
  }

  hasPrevPage(page) {
    return page > 1;
  }
  render() {
    const { props } = this;

    const { pagesToShow } = props;

    const currentPage = this.getCurrentPage();
    const maxPage = this.getMaxPage();
    const hasNextPage = this.hasNextPage(currentPage);
    const hasPrevPage = this.hasPrevPage(currentPage);

    const pagesToSides = Math.floor(pagesToShow / 2); //5

    let startPage = currentPage - pagesToSides;
    let endPage = currentPage + pagesToSides;

    if (startPage < 1 + pagesToSides) {
      startPage = 1;
      endPage = startPage + pagesToShow;
    }
    if (endPage > maxPage - pagesToSides) {
      endPage = maxPage;
      startPage = endPage - pagesToShow;
    }

    startPage = Math.max(1, startPage);
    endPage = Math.min(maxPage, endPage);

    const middlePages = [];

    if (startPage > 1) {
      middlePages.push(this.renderPage("..."));
    }

    for (let i = startPage; i <= endPage; i++) {
      middlePages.push(this.renderPage(i, i));
    }

    if (endPage < maxPage) {
      middlePages.push(this.renderPage("..."));
    }

    const items = [
      this.renderNavButton({
        key: "first",
        disabled: currentPage <= 1,
        onClick: () => this.gotoPage(1),
        children: <FirstIcon />
      }),
      this.renderNavButton({
        key: "prev",
        disabled: !hasPrevPage,
        onClick: () => this.gotoPrevPage(),
        children: <PrevIcon />
      }),
      ...middlePages,

      this.renderNavButton({
        key: "next",
        disabled: !hasNextPage,
        onClick: () => this.gotoNextPage(),
        children: <NextIcon />
      }),
      this.renderNavButton({
        key: "last",
        disabled: currentPage >= maxPage,
        onClick: () => this.gotoPage(maxPage),
        children: <LastIcon />
      })
    ];

    return (
      <div
        className={join(
          "inline-flex flex-row br2",
          this.props.className,
          styles.pagination
        )}
        children={items}
      />
    );
  }

  renderNavButton({ disabled, onClick, children, key }) {
    return (
      <button
        key={key}
        className={join(
          styles.navButton,
          styles.pageBlock,
          disabled && styles.disabled
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  renderPage(children, page) {
    const isCurrent = page === this.getCurrentPage();

    const Tag = page == null ? "div" : "button";

    return (
      <Tag
        key={page}
        className={join(
          styles.pageBlock,
          children == '...' && styles.disabled,
          page != null && styles.page,
          "pa2",
          isCurrent && styles.currentPage
        )}
        onClick={() => {
          if (page != null) {
            this.gotoPage(page);
          }
        }}
      >
        {children}
      </Tag>
    );
  }
}

PaginationToolbar.defaultProps = {
  onPageChange: () => { },
  onSkipChange: () => { },
  pagesToShow: 3
};

PaginationToolbar.propTypes = {
  pagesToShow: PropTypes.number,
  totalCount: PropTypes.number,
  skip: PropTypes.number,
  limit: PropTypes.number,
  onPageChange: PropTypes.func,
  onSkipChange: PropTypes.func
};
export default PaginationToolbar;
