class Base {

  constructor(){
    if(!Base.subRenderCounter){
      Base.subRenderCounter = 1;
      Base.renderingInProgress = false;
      Base.renderQueue = [];
    }
  }

  render(selector = '', templateNo = ''){

    // The basic idea is that the render method calls
    // template methods ("template" + templateNo)
    // gets the html generated and pushes it to the dom

    if(Base.renderingInProgress){
      // If rendering is in progress then the call
      // to render is from inside a template
      // (delay execution of this "subrendering")
      return this.subrender(templateNo);
    }

    Base.renderingInProgress = true;
    let oldBaseEl = this.baseEl;
    this.baseEl = $(this['template' + templateNo]());
    this.addEvents(templateNo);

    // If subrendering to a temporary holder
    if(selector.indexOf('.temp-render-holder') == 0){
      $(selector).replaceWith(this.baseEl)
    }
    // If rerendering to existing place in the DOM
    else if (!selector && oldBaseEl){
      oldBaseEl.replaceWith(this.baseEl);
    }
    // If rendering to a specific element in DOM
    else {
      $(selector || 'main').append(this.baseEl);
    }

    Base.renderingInProgress = false;

    // Take care of delayed subrendering
    while(Base.renderQueue.length){
      let queued = Base.renderQueue.shift();
      queued.obj.render.apply(queued.obj, queued.args);
    }

    Footer.footerFix();

  }

  subrender(templateNo){
    // Temporarily return a unique holder for things to be subrendered
    Base.subRenderCounter++;
    let className = `temp-render-holder-${Base.subRenderCounter}`;
    Base.renderQueue.push({obj: this, args: [`.${className}`, templateNo]});
    return `<option class="${className}"/>`;
  }

  addEvents(templateNo){
    // Add events to baseElements - so that an event calls a corresponding
    // method in the class (named event type + templateNo)
    let types = ['click', 'keyup', 'mouseenter', 'mouseleave','change', 'mouseover', 'mouseout'];
    for(let type of types){
      let methodName = type + templateNo;
      if(this[methodName]){
        this.baseEl[type]((e) => this[methodName](e));
      }
    }
  }

}
