export default function Browser () {
    const models = [
        {
            'type': 'stl',
            'name': 'test',
            'stlUrl': 'test.stl',
            'image': '/test.jpg',
        }, {
            'type': 'stl',
            'name': 'test2',
            'stlUrl': 'test2.stl',
            'image': '/test2.jpg',
        }, {
            'type': 'stl',
            'name': 'test3',
            'stlUrl': 'test3.stl',
            'image': '/test3.jpg',
        }, {
            'type': 'folder',
            'name': 'test4',
            'image': '/test4.jpg',
        }
    ]

    return <div className={styles.Browser}>
        {
            models.map((model, index) => {
                return <div className={styles.BrowserButton} onClick={() => setActiveUrl(model.stlUrl)}>
                    <img src={model.image} />
                    <p>{model.name}</p>
                </div>
            })
        }
    </div>
}
