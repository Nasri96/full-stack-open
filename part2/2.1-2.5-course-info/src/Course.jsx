const Header = (props) => {
  // console.log(props);
    return (
        <h1>{props.course.name}</h1>
    )
}

const Part = (props) => {
  // console.log(props);
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  // console.log(props);
  return (
    <div>
        {props.course.parts.map(part => {
            return <Part key={part.id} name={part.name} exercises={part.exercises} />
        })}
    </div>
    
    
  )
}

const Total = (props) => {
  // console.log(props);
  // const totalExercises = props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises;
  const totalExercises = props.course.parts.reduce((accumulator, currentValue) => {
    // console.log(accumulator);
    // console.log(currentValue.exercises);
    return accumulator + currentValue.exercises;
  }, 0);
  return (
    <p><b>Number of exercises {totalExercises}</b></p>
  )
}

function Course({ course }) {
    // console.log(course);
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}

export default Course;