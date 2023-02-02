import { useState } from 'react'

export default function Card({ author, sentence, school, title, id }) {
	const [open, setOpen] = useState(false)
	const [passage, setPassage] = useState('Retrieving sentences...')
	const [nextID, setNextID] = useState(id)

	const getNext = (more) => {
		if (nextID === id || (more && nextID - id < 10)) {
			fetch('https://philos-ai-api-tlvor5bzuq-uc.a.run.app/next/' + nextID + '?count=5')
				.then(res => res.json())
				.then(data => {
					let newPassage = nextID === id ? sentence : passage
					Object.values(data).map(next => {
						newPassage += ' ' + next;
					})
					setPassage(newPassage)
					setNextID(nextID + 5)
				})
				.catch(e => console.log(e))
			}
		setOpen(true)
	}

	return (
		<div>
			<div className='w-full hover:scale-105 transition duration-250 cursor-pointer bg-white border border-gray-200 font-mono drop-shadow-md hover:drop-shadow-xl flex flex-col justify-between h-60 px-4 py-6'>
				<div className='h-36 overflow-y-hidden text-ellipsis z-2' onClick={() => getNext()}>
					<p>
						{sentence}
					</p>
				</div>
				<p>
					{'-' + author + ', '}
					<span className='italic'>{title}</span>
				</p>
			</div>
			{open &&
				<div className='absolute h-full w-screen top-0 right-0 z-10'>
					<div className='absolute bg-gray-500 bg-opacity-40 w-full h-full' onClick={() => setOpen(false)}>
					</div>
					<div className='sticky mx-auto font-mono p-4 max-w-3xl h-fit top-24 border border-gray-200 mb-24 bg-white z-20'>
						<p className='mb-4'>
							{author + ', '}
							<span className='italic'>{title}</span>
						</p>
						<p className='mb-4'>
						{passage}
						</p>
						{nextID - id < 10 && <a className='block cursor-pointer z-20' onClick={() => getNext(true)}>[read more]</a>}
					</div>
				</div>
			}
		</div>
	)
}
