# react-cross-fader

``npm install react-cross-fader --save``

A minimalistic library to allow animated transitions between any react elements.
Transitions are handled using CSS Keyframes animations.

Basic usage is very simple. Just wrap any element with `CrossFader` comonent:

```tsx
<CrossFader>
    <div>Some content</div>
</CrossFader>
```

Then, if you replace the children of `CrossFader` with something else, the existing content will fade out and the new content will fade in.

### Example:

```tsx
import {useState} from 'react';
import {CrossFader} from 'react-cross-fader';

const labels: string[] = [
    'This is a react-cross-fader library',
    'A tiny library for fade-in/fade-out transitioning',
    'Flexible',
    'Easy to use',
    'Beautiful'
];

function App() {
    const [labelIndex, setLabelIndex] = useState(0);

    const nextLabel = () => {
        setLabelIndex((cur) => (cur + 1) % labels.length)
    };
    
    const curLabel = labels[labelIndex];

    return (
        <CrossFader distinctKey={curLabel}>
            <div onClick={() => nextLabel()}>
                {curLabel}
            </div>
        </CrossFader>
    );
}
```

When clicking through labels, previous label will fade out and next one will fade in.


## Using custom fade-in / fade-out animations

The default fade-in/fade-out animations are as basic as they can possibly be.
This lib assumes that you will use custom css animations to set up the transitions you need.

For that you just need to define your transitions using `@keyframes` and override provided CSS variables:


### Default values
```css

@keyframes defaultFadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes defaultFadeOut {
    100% {
        opacity: 0;
    }
}


--fade-in-animation: defaultFadeIn 0.2s ease;
--fade-in-delay: 0s;
--fade-out-animation: defaultFadeOut 0.2s ease;
--fade-out-delay: 0s;
```

### Example override

```jsx
<div className='my-wrapper'>
    <CrossFader>
        ...some children
    </CrossFader>
</div>
```
```css
@keyframes myFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

@keyframes myFadeOut {
  0% {
    opacity: 1;
    transform: translateY(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.my-wrapper {
    --fade-in-animation: myFadeIn 0.4s ease;
    --fade-out-animation: myFadeOut 0.5s ease;
    --fade-in-delay: 0.1s;
}
```

## API


|           prop           |       type       | default value |                                     description                                     |
|:------------------------:|:----------------:|:-------------:|:-----------------------------------------------------------------------------------:|
| destroyOnFadeOutComplete |     boolean      |     true      | whether to remove previous element from DOM once the fade out animation is complete |
|    onFadeOutComplete     |    () => void    |   undefined   |              callback to be called once fade out animation is complete              |
|     onFadeInComplete     |    () => void    |   undefined   |              callback to be called once fade in animation is complete               |
|       distinctKey        | string \| number |   undefined   |             key that is checked to identify whether content has changed             |
|          delay           |      number      |       0       |       time in ms to wait before starting transitions once content is changed        |








