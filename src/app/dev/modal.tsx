import { useModalStack } from '~/components/universal/Modal/stack.context'

export default () => {
  const { present } = useModalStack()
  const pp = () => {
    const cl = present({
      component: (props) => (
        <span className="h-100">
          <p className="break-all">
            {props.name} Iusto architecto facere. Ipsa deleniti aut. Debitis
            dolores quia iste aut eum eaque. Beatae excepturi ea. Non in
            suscipit necessitatibus. Cum nobis dolorem libero explicabo
            mollitia.
          </p>
          <button onClick={() => cl()}>Dispose</button>
          <br />
          <button
            onClick={() => {
              const p = () =>
                present({
                  component: () => (
                    <span
                      className="bg-gray-1"
                      style={{
                        height: `${Math.random() * 100 + 50}px`,
                        width: `${Math.random() * 100 + 50}px`,
                      }}
                    >
                      <button
                        onClick={() => {
                          p()
                        }}
                      >
                        Present
                      </button>
                    </span>
                  ),
                })

              p()
            }}
          >
            Present
          </button>
        </span>
      ),
      props: {
        name: 'Foo',
      },
      modalProps: {
        title: 'Hello',
        closeable: true,
      },
    })
  }

  // useEffect(() => {
  //   present({
  //     component: (props) => (
  //       <div className="h-50 w-50">Hello, {props.name}</div>
  //     ),
  //     props: {
  //       name: 'Foo',
  //     },
  //     modalProps: {},
  //   })

  //   present({
  //     component: (props) => <div>Hello, {props.name}</div>,
  //     props: {
  //       name: 'Bar',
  //     },
  //     modalProps: {},
  //   })
  // }, [])
  return (
    <span>
      <button onClick={pp}>present</button>
      <br />
    </span>
  )
}
