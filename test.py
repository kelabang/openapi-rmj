###env
url = 'http://localhost:8080'
url = url + '/v2'
###env

## Requester rumaji

# test
get(url+'/hello/imam')

# feeds
get(url+'/feeds')

# stories
get(url+'/story')
get(url+'/story/find?title=hehe&status=draft')

post(
	url+'/story',
	{
		'title': 'lorem ipsum', 
		'content': """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis risus id ante consequat, efficitur sollicitudin lacus tincidunt. Nulla luctus venenatis nibh eget tincidunt. Nullam efficitur, ipsum eu pulvinar commodo, libero eros aliquet turpis, id ultricies nulla mi quis sem. Pellentesque ultricies nisi vel nibh malesuada porttitor. Fusce viverra efficitur ultricies. Nam aliquam, diam sit amet efficitur consequat, erat elit dignissim ante, non congue massa quam sed mauris. Duis ac posuere metus. Vestibulum at sem in odio interdum rhoncus. Vestibulum tincidunt turpis eget dui maximus lacinia.

			Suspendisse augue nulla, sagittis nec pellentesque vitae, dictum imperdiet risus. Etiam id feugiat quam. Pellentesque facilisis condimentum augue, non consectetur turpis. Maecenas molestie, neque quis condimentum hendrerit, ante eros viverra sem, nec rutrum sapien lectus sit amet velit. Nam elementum ante nisi. Aliquam ullamcorper velit a augue malesuada consequat. Aenean rutrum vehicula sapien, ac eleifend magna. Praesent rhoncus lacus id purus ultricies consectetur. Suspendisse quis varius nibh. Morbi ornare venenatis varius.

			Phasellus cursus nisl in ante tincidunt gravida. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas tempor blandit nisi aliquet facilisis. Proin vehicula risus nec dui finibus rhoncus. Aliquam mollis ex magna, eget lobortis velit congue non. Nulla vulputate nisi a massa placerat placerat. In mollis venenatis ante, id gravida tellus varius eu. Donec non tincidunt risus, sit amet tristique arcu. Quisque purus mauris, semper at rutrum vel, sagittis sed felis. Curabitur justo ipsum, aliquam quis ante at, consequat porta purus.

			Vivamus sollicitudin laoreet ante vel sodales. Morbi blandit elit quis posuere interdum. Sed ac sem vel erat tempus luctus. Vestibulum at risus efficitur, fermentum sapien id, bibendum dolor. Pellentesque placerat nisl at ultricies ultricies. Duis sit amet efficitur urna. In bibendum pellentesque velit, sit amet sodales diam egestas et. Duis ullamcorper sodales elit ac mollis. Nullam imperdiet finibus arcu vitae aliquam. Praesent accumsan ultrices dolor nec semper. Aenean nisl lorem, commodo vitae dui eu, vulputate hendrerit erat. Nulla a sodales nunc, pulvinar vestibulum nisl. Nam interdum placerat mi ac laoreet. Etiam vulputate tellus eget urna condimentum faucibus. Curabitur aliquet tortor vel porta pellentesque. Morbi id consectetur justo.

			Nulla ac nulla hendrerit, euismod eros eu, ultrices mi. Vestibulum a lectus quis purus bibendum semper. Suspendisse convallis eu nulla eu consectetur. Cras auctor, erat a tempus porttitor, massa tortor porta nulla, id suscipit justo massa quis mauris. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus pellentesque eros eget lectus maximus ultrices. Vivamus at leo nec elit congue egestas. In a molestie ante. Maecenas rhoncus dui sit amet lorem gravida pellentesque. Vestibulum pulvinar elit ac consectetur sollicitudin. Praesent vitae velit lacinia, faucibus arcu ac, semper leo. Donec ac odio vel risus imperdiet convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In eleifend odio sagittis eros feugiat, vitae venenatis neque efficitur."""
})

put(
	url+'/story/8',
	{'title': 'ubah 1', 'content': 'para para'}
)

post(
	url+'/story/2/publish',
)

delete(
	url+'/story/1'
)

post(
	url+'/story',
	headers={'Authorization': 'Bearer code'},
	json={'title': 'test', 'text': 'para para'}
)
post(
	url+'/story/1/alineas',
	headers={'Authorization': 'Bearer code'},
	json={'text': 'para para'}
)
# users
get(url+'/users')
