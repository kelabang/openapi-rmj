###env
url = 'http://localhost:8080'
url = url + '/v2'
###env

## Requester rumaji

# test
get(url+'/hello/imam')

# users
get(url+'/user')
post(url+'/user/registration', 
	{
		'username': 'nooble1',
		'password': '123654',
		'email': 'imam.tauhid.dar1@icloud.com'
	})

#auth
post(url+'/auth/password', 
	{
		'username': 'nooble1',
		'password': '123654',
		'email': 'imam.tauhid.dar1@icloud.com'
	})
post(url+'/auth/facebook', 
	{
		"userID": "EAACluZBYteuEBAAAqk7kyH27FGjo0Q0JsaTvdJtjYogD2cyNwzZBHc7uZAnk0YXiXgrYrgXW9QiZB89vH1CgC1BZB82kZBSfJTQYYld6gaMBwvRkl3UY3QxxyJuL5Pnfd81mnvShEXGMX7gvXEnMEwfs668scz4NhjFgTjeIX83vepnW7wksSmdviqLZAniHhPZBQZCJva2ABhNkrfcmFLNZAX",
		"accessToken": "106440456841960",
	})

# feeds
get(url+'/feed?id=30&mode=prev')
get(url+'/feed?id=5')
get(url+'/ma4m/feed')

#profile
get(url+'/profile/ma4m')

# stories
get(
	url+'/story',
	headers={'Authorization':'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE4Mjg2MzQ1LCJleHAiOjE1MTgyODk5NDUsImlzcyI6InJ1bWFqaS5jb20ifQ.nuykJjm1C4rxFaX4sHX1LBwrgr9uq-d5cgeTL1uDPLGbJgUZVdsRG4RTbyPPsRr0pUs_Xxoh1gdK0cikPni1F4VDmkoOIL-oxLKVnhXOb6FnqNQCRERlWd5_vs0CBTPiTA9DVbbLAJ5ougpDTqXIFsNQZf6lMeV7c3kqpfhYSuM4nCfDyXxh9PAlJclFtYLKuypi2Xzjj719eXBBJBt6Ju7cwKg--P6jeZxYXodRQuMO5_tHE3XQJWrmGEGoRZnqTIHKvqkL0_CHctZHJcVEPStgut3EWi7o5xGOiCHt86xbuwiHyoeMyj66E4mHrT41xDh-Ibg6WFfSSzyNFYATHA'},
)

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
	url+'/story/2',
	{'title': 'ubah 2', 'content': 'para para'}
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
