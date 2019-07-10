import React from 'react';
import '../../../css/SwipeableListItem.css';

class SwipeableListItem extends React.Component {
  // DOM Refs
  listElement = React.createRef(null);
  wrapper = React.createRef(null);
  background = React.createRef(null);

  // Drag & Drop
  dragStartX = 0;
  left = 0;
  dragged = false;

  // FPS Limit
  startTime;
  fpsInterval = 1000 / 60;

  componentDidMount() {
    window.addEventListener('mouseup', this.onDragEndMouse);
    window.addEventListener('touchend', this.onDragEndTouch);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onDragEndMouse);
    window.removeEventListener('touchend', this.onDragEndTouch);
  }

  onDragStartMouse = evt => {
    this.onDragStart(evt.clientX);
    window.addEventListener('mousemove', this.onMouseMove);
  };

  onDragStartTouch = evt => {
    const touch = evt.targetTouches[0];
    this.onDragStart(touch.clientX);
    window.addEventListener('touchmove', this.onTouchMove);
  };

  onDragStart = clientX => {
    this.dragged = true;
    this.dragStartX = clientX;
    this.listElement.current.className = 'ListItem';
    this.startTime = Date.now();
    requestAnimationFrame(this.updatePosition);
  };

  onDragEndMouse = evt => {
    window.removeEventListener('mousemove', this.onMouseMove);
    this.onDragEnd();
  };

  onDragEndTouch = evt => {
    window.removeEventListener('touchmove', this.onTouchMove);
    this.onDragEnd();
  };

  onDragEnd = () => {
    if (this.dragged) {
      this.dragged = false;

      const threshold = this.props.threshold || 0.3;

      if (this.left < this.listElement.current.offsetWidth * threshold * -1) {
        this.left = -this.listElement.current.offsetWidth * 2;
        this.wrapper.current.style.maxHeight = 0;
        this.onSwiped();
      } else {
        this.left = 0;
      }

      this.listElement.current.className = 'BouncingListItem';
      this.listElement.current.style.transform = `translateX(${this.left}px)`;
    }
  };

  onMouseMove = evt => {
    const left = evt.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  };

  onTouchMove = evt => {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  };

  updatePosition = () => {
    if (this.dragged) requestAnimationFrame(this.updatePosition);

    const now = Date.now();
    const elapsed = now - this.startTime;

    if (this.dragged && elapsed > this.fpsInterval) {
      this.listElement.current.style.transform = `translateX(${this.left}px)`;

      const opacity = (Math.abs(this.left) / 100).toFixed(2);
      if (
        opacity < 1 &&
        opacity.toString() !== this.background.current.style.opacity
      ) {
        this.background.current.style.opacity = opacity.toString();
      }
      if (opacity >= 1) {
        this.background.current.style.opacity = '1';
      }

      this.startTime = Date.now();
    }
  };

  onClicked = () => {
    if (this.props.onSwipe) {
      this.props.onSwipe();
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  onSwiped = () => {
    if (this.props.onSwipe) {
      this.props.onSwipe();
    }
  };

  render() {
    return (
      <>
        <div className="Wrapper" ref={this.wrapper}>
          <div ref={this.background} className="Background">
            {this.props.background ? (
              this.props.background
            ) : (
              <span>Delete</span>
            )}
          </div>
          <div
            onClick={this.onClicked}
            ref={this.listElement}
            onMouseDown={this.onDragStartMouse}
            onTouchStart={this.onDragStartTouch}
            className="ListItem"
          >
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
}

export default SwipeableListItem;
