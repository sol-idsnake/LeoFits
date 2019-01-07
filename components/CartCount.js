import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const AnimationStyles = styled.span`
  position: relative;
  .count {
    backface-visibility: hidden;
    display: block;
    position: relative;
    transition: all 0.4s;
  }
  /* Initial state of the entered dot */
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    position: absolute;
    top: 0;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

const Dot = styled.div`
  background: ${props => props.theme.red};
  border-radius: 50%;
  color: white;
  font-weight: 100;
  line-height: 2rem;
  margin-left: 1rem;
  min-width: 3rem;
  padding: 0.5rem;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
`;

const CartCount = ({ count }) => (
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        timeout={{ enter: 400, exit: 400 }}
        className="count"
        classNames="count"
        key={count}
      >
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>
);

export default CartCount;
