# Ghostwriterz Server

## API Documentation

### Description

This api allows you to use CRUD operations for sharing your song lyrics around the world for others to use. Within this documentation, you'll find out how to start creating and posting your own personal song lyrics to the Ghostwriterz database.

#### *[LIVE APP](https://ghostwriterz-app.vercel.app/)*

#### *[FRONTEND REPO](https://github.com/JakelTheDeveloper/ghostwriterz-app-client)*

#### Version

-1.0.0

## Servers

### Lyrics Server

#### URL: 

```
                    morning-tundra-70520.herokuapp.com/api/lyrics
```

#### DESCRIPTION:

 

``` 
                    method: GET 
```

#### URL: 

```
                    morning-tundra-70520.herokuapp.com/api/lyrics
```

#### DESCRIPTION: 

``` 
                    method: 'POST',
                    body: JSON.stringify({
                        title: title,
                        genre: genre,
                        mood: mood,
                        artist: artist,
                        lyrics: lyrics
                    }),
                    headers: { 'Content-Type': 'application/json' }

                    expect(201)
```      
```
                     //Genre must be one of Types

                      'Hip Hop',
                      'Pop',
                      'Rock',
                      'Jazz',
                      'Folk',
                      'Musical',
                      'Country',
                      'Classical',
                      'Heavy Metal',
                      'Rhythm and Blues',
                      'Electronic Dance',
                      'Punk',
                      'Soul',
                      'Electronic Music',
                      'Rap',
                      'Reggae',
                      'Funk',
                      'Disco',
                      'House',
                      'Techno',
                      'Gospel'
``` 

```
                      //Moods must be one of Types

                      'Happy',
                      'Energetic',
                      'Sad',
                      'Calm',
                      'Depression',
                      'Anger',
                      'Carefree',
                      'Gloomy',
                      'Annoyed'
``` 

#### URL:

```
                      morning-tundra-70520.herokuapp.com/api/lyrics/lyric_id
```

#### DESCRIPTION: 

```
                      method: 'PATCH',
                      body: JSON.stringify({
                          id: id,
                          title: title,
                          genre: genre,
                          mood: mood,
                          artist: artist,
                          lyrics: lyrics
                      }),
                      headers: {
                          "Content-Type": "application/json; charset=UTF-8"
                      }

                      expect(201)
``` 

#### URL: 

```
                      morning-tundra-70520.herokuapp.com/api/lyrics/lyric_id
```

#### DESCRIPTION: 

```
                      method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json'
                      },
                    })

                      expect(204)
``` 

### Users Server

#### URL: 

```
                      morning-tundra-70520.herokuapp.com/api/users
```

#### DESCRIPTION: REGISTER

```
                      method: 'POST',
                      body: JSON.stringify({
                          fullname:fullname,
                          username:email,
                          nickname:username,
                          password:password,
                          passwordConfirm:password_confirm
                      }),
                      headers: {
                          'Content-Type': 'application/json',
                        }
                      })

                      expect(201)
``` 

#### URL: 

```
                      morning-tundra-70520.herokuapp.com/api/auth/signin
```

#### DESCRIPTION: LOGIN

```
                      method:'POST',
                      body: JSON.stringify({
                      username:username,
                      password:password
                      }),
                      headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                        }
                      })

                      expect(204)
```

               
