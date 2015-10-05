// ----------------------------------------------------------------------------
//
// File: Utils.js
//
// Description:
//
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
function List() {

  this.init = false;
  this.elementCount = 0;
  this.elementInPageCount = 0;
  this.pageCount = 0;

  this.currentPageIndex = 0;
  this.elementInCurrentPageIndex = 0;
  this.currentElementIndex = 0;

  
  this.currentElementGhangedCallback = null;
  this.currentPageGhangedCallback = null;
  this.currentElementsEndCallback = null;
  this.currentElementsStartCallback = null;
  this.files = [];
  this.elements = [];

  // ----------------------------------------------------------------------------
  this.getPageCount = function() {

    this.pageCount = 0;

    if (this.elementInPageCount > 0) {

      var lpageCount = this.elementCount / this.elementInPageCount;
      var lpageCountInt = Math.round(lpageCount);

      // если произошло округлление в меньшую сторону добавляем одну страницу
      if (lpageCount > lpageCountInt) {
        this.pageCount = lpageCountInt + 1;
      } else {
        this.pageCount = lpageCountInt;
      }
    }
  }


  // ----------------------------------------------------------------------------
  this.UpdateCurrentElementIndex = function() {

    this.currentElementIndex = this.elementInCurrentPageIndex + this.elementInPageCount * this.currentPageIndex;
  }



  this.Init = function(elements, aElementInPageCount) {
    this.elementCount = elements.length;
    this.elementInPageCount = aElementInPageCount;
    this.elements = elements;
    
    this.pageCount = 0;
    this.currentPageIndex = 0;
    this.elementInCurrentPageIndex = 0;
    this.currentElementIndex = 0;

    if ((this.elementCount > 0) || (this.elementInPageCount > 0)) {

      this.getPageCount();

      this.init = true;
    } else {
      this.init = false;
    }

    return this.init;
  }


  // ----------------------------------------------------------------------------
  this.SetNextPage = function() {

    this.currentPageIndex++;
    if (this.currentPageIndex > this.pageCount - 1) {
      this.currentPageIndex = 0;
      if (this.currentElementsEndCallback) {
        this.currentElementsEndCallback();
      }
    }
    this.UpdateCurrentElementIndex();
    if (this.currentPageGhangedCallback) {
      this.currentPageGhangedCallback();
    }

    if (this.currentElementIndex > this.elementCount - 1) {
      this.currentElementIndex = this.elementCount - 1;
      this.elementInCurrentPageIndex = this.currentElementIndex - this.currentPageIndex*this.elementInPageCount;
    }

    if (this.currentElementGhangedCallback) {
      this.currentElementGhangedCallback();
    }

  }


  // ----------------------------------------------------------------------------
  this.SetPrevPage = function() {
    
    this.currentPageIndex--;
    if (this.currentPageIndex < 0) {
      this.currentPageIndex = this.pageCount - 1;
      
      if (this.currentElementsStartCallback) {
        this.currentElementsStartCallback();
      }
    }

    this.UpdateCurrentElementIndex();
    if (this.currentPageGhangedCallback) {
      this.currentPageGhangedCallback();
    }

    if (this.currentElementIndex > this.elementCount - 1) {
      this.currentElementIndex = this.elementCount - 1;
      this.elementInCurrentPageIndex = this.currentElementIndex - this.currentPageIndex*this.elementInPageCount;

    }

    if (this.currentElementGhangedCallback) {
      this.currentElementGhangedCallback();
    }

  }


  // ----------------------------------------------------------------------------
  this.SetCurrentElementByIndex = function(aIndex) {

    if (this.init) {
      this.prevElementInCurrentPageIndex = this.elementInCurrentPageIndex;
      if ((aIndex >= 0) && (aIndex < this.elementCount)) {

        var aPageIndex = (aIndex / this.elementInPageCount) | 0;
        var aElementInPageIndex =  aIndex - aPageIndex * this.elementInPageCount;

        var lneedUpdateCurrentPage = false;
        var lneedUpdateCurrentElement = false;

        if (aPageIndex !== this.currentPageIndex) {
          this.currentPageIndex = aPageIndex;
          lneedUpdateCurrentPage = true;
        }

        if (aElementInPageIndex !== this.elementInCurrentPageIndex) {
          this.elementInCurrentPageIndex = aElementInPageIndex;
          lneedUpdateCurrentElement = true;
        }

        this.UpdateCurrentElementIndex();

        if (lneedUpdateCurrentElement) {
          if (this.currentElementGhangedCallback) {
            this.currentElementGhangedCallback();
          }
        }

        if (lneedUpdateCurrentPage) {
          if (this.currentPageGhangedCallback) {
            this.currentPageGhangedCallback();
          }
        }

      }
    }

  }


  // ----------------------------------------------------------------------------
  this.MoveCurrentElementToDown = function() {

    if (this.init) {
      this.prevElementInCurrentPageIndex = this.elementInCurrentPageIndex;
      this.elementInCurrentPageIndex++;

      if (this.elementInCurrentPageIndex > this.elementInPageCount - 1){
        this.elementInCurrentPageIndex = 0;
        this.SetNextPage();
        
      }

      this.UpdateCurrentElementIndex();

      if (this.currentElementIndex > this.elementCount - 1) {
        this.currentElementIndex = this.elementCount - 1;

        this.currentPageIndex = 0;
        this.elementInCurrentPageIndex = 0;
        this.currentElementIndex = 0;

        if (this.currentPageGhangedCallback) {
          this.currentPageGhangedCallback();
        }
        if (this.currentElementsEndCallback) {
          this.currentElementsEndCallback();
        }
      }


      if (this.currentElementGhangedCallback) {
        this.currentElementGhangedCallback();
      }

      return true;
    }
    return false;
  }


  // ----------------------------------------------------------------------------
  this.MoveCurrentElementToUp = function() {
    if (this.init) {
      this.prevElementInCurrentPageIndex = this.elementInCurrentPageIndex;
      this.elementInCurrentPageIndex--;
      if (this.elementInCurrentPageIndex < 0){
        this.elementInCurrentPageIndex = this.elementInPageCount - 1;
 
        this.SetPrevPage();
        
       
      }

      this.UpdateCurrentElementIndex();

      if (this.currentElementIndex > this.elementCount - 1) {
        this.currentElementIndex = this.elementCount - 1;

        this.currentPageIndex = this.pageCount - 1;
        this.currentElementIndex = this.elementCount - 1;
        this.elementInCurrentPageIndex = this.currentElementIndex - this.currentPageIndex*this.elementInPageCount;

        if (this.currentPageGhangedCallback) {
          this.currentPageGhangedCallback();
        }
      }

      if (this.currentElementGhangedCallback) {
        this.currentElementGhangedCallback();
      }

    }
    return false;
  }


  // ----------------------------------------------------------------------------
  this.SetCurrentPageGhangedCallback = function(aCurrentPageGhangedCallback) {
    this.currentPageGhangedCallback = aCurrentPageGhangedCallback;
  }
  
  // ----------------------------------------------------------------------------
  this.SetCurrentElementGhangedCallback = function(aCurrentElementGhangedCallback) {
    this.currentElementGhangedCallback = aCurrentElementGhangedCallback;
  }
  this.SetCurrentElementsEndCallback = function(aCurrentElementsEndCallback) {
    this.currentElementsEndCallback = aCurrentElementsEndCallback;
  }
  
  this.SetCurrentElementsStartCallback = function(aCurrentElementsStartCallback) {
    this.currentElementsStartCallback = aCurrentElementsStartCallback;
  }

  // ----------------------------------------------------------------------------
  this.GetElementInCurrentPageIndex = function() {
    return this.elementInCurrentPageIndex;
  }

  // ----------------------------------------------------------------------------
  this.GetListPageCount = function() {
    return this.pageCount;
  }

  // ----------------------------------------------------------------------------
  this.GetCurrentPageIndex = function() {
    return this.currentPageIndex;
  }

  // ----------------------------------------------------------------------------
  this.GetCurrentElementIndex = function() {
    return this.currentElementIndex;
  }

  // ----------------------------------------------------------------------------
  this.GetElementCount = function() {
    return this.elementCount;
  }
  
  this.addFiles = function(data) {
    this.files.push(data);
  }
  this.emptyFiles = function() {
    this.files =[];
  }

  this.getCurrentElement = function() {
    element = this.elements[this.GetCurrentElementIndex()];
    if (element !== undefined) {
      element.idInArray = this.GetCurrentElementIndex();
    }
    
    return element;
  }
  
  this.getElementById = function(id) {
    element = this.elements[id];
    if (element) {
      element.idInArray = id;
    }
    
    return element;
  }
  this.setValToProperty = function(val,property) {
    this.elements[this.GetCurrentElementIndex()][property] = val;
  }
}