import React, { Component } from 'react';
import {observable, computed, extendObservable, action, useStrict} from 'mobx';
import {observer} from 'mobx-react';
import {lazyObservable, fromPromise} from 'mobx-utils';

useStrict(true);

function loadable(getterName, initialValue) {

  return (target, name, descriptor) => {

    const promise = descriptor.value;

    const errorObservable = observable.box();
    const valueObservable = observable.box(initialValue);

    const setErrorAction = action((error, preserveValue = false) => {
      errorObservable.set(error);
      if (!preserveValue){
        valueObservable.set(initialValue);
      }
    });

    const setValueAction = action((value) => {
      valueObservable.set(value);
      errorObservable.set();
    });

    const lazyValueObservable = lazyObservable((sink) => {

      sink(true);

      promise()
        .then(setValueAction)
        .catch(setErrorAction)
        .then(() => {
          sink(false);
        });

    }, false);

    const newProps = {};

    newProps[getterName] = computed(() => {
      //trigger the lazy load
      lazyValueObservable.current();
      return valueObservable.get();
    });

    newProps[getterName + 'Reset'] = action(() => {
      setValueAction(initialValue);
    });

    newProps[getterName + 'Reload'] = action(() => {
      errorObservable.set();
      lazyValueObservable.refresh();
    });

    newProps[getterName + 'IsLoading'] = computed(() => lazyValueObservable.current())
    newProps[getterName + 'Error'] = computed(() => errorObservable.get());
    newProps[getterName + 'SetError'] = setErrorAction;

    extendObservable(target, newProps);

    Object.defineProperty(target, getterName, {
      set: (value) => setValueAction(value)
    });

    return descriptor;
  };
}

class Store {

  @loadable('something', [])
  _something() {

    return new Promise((resolve, reject) => {

      console.log('running promise');
      setTimeout(() => {

        Math.random() > .25  ? resolve([1,2,3,4,5,6,7,8]) : reject('Rejection reason');

      }, 3000);

    });
  }

  @computed get somethingFiltered() {
    return this.something.filter((e) => e % 2);
  }
}

@observer
class LoadableThing extends Component {


  render () {

    const {store} = this.props;

    return <div>
      Loading: {store.somethingIsLoading ? "true" : "false"}<br />
      Original: {store.something.join(',')}<br />
      Filtered: {store.somethingFiltered.join(',')}<br />
      Error: {store.somethingError ? store.somethingError : "false"}<br />
      <button onClick={() => store.something = [11,12,13,14,15,16,17,18]}>Set Value</button><br />
      <button onClick={() => store.somethingSetError('Error Preserve', true)}>Set Error (Preserve Value)</button><br />
      <button onClick={() => store.somethingSetError('Error')}>Set Error (Reset Value)</button><br />
      <button onClick={() => store.somethingReset()}>Reset</button><br />
      <button onClick={() => store.somethingReload()}>Reload</button><br />
    </div>;
  }
}


export default class App extends Component {
  render = () => (
    <div>
      <LoadableThing store={ new Store() }/>
    </div>
  );
}

