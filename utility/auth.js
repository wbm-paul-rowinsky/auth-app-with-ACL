import passport from "passport";
import LocalStrategy from "passport-local";
import { User, makeUser } from "../models/user.model.js";

passport.serializeUser((user, done) => {
  console.log("serializeUser(), user.id: ", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userDb = await User.findById(id);
    console.log("deserializeUSer(), userDb: ", userDb);
    done(null, userDb);
  } catch (error) {
    done(error);
  }
});

//rejestracja uytkownika na stronie - register(!)
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
          // jest juz user w bazie
          return done(null, false); // konczymy bo user istnieje
        }
        const user = makeUser(email, password);
        const userDb = await user.save();
        return done(null, userDb); //user jest zarejestrowany
      } catch (error) {
        done(error);
      }
    }
  )
);

const authUser = async (req, email, password, done) => {
  //authuser to funkcja pozwalająca na autoryzację uzytkownika, zwraca zautoryzowanego
  //uzytkownika np z bazy, authUser uzywana jest przez strategię do autoryzacji
  try {
    const authenticatedUser = await User.findOne({ email });
    if (!authenticatedUser) {
      // nie ma usera w bazie o tym imieniu
      return done(null, false);
    }

    if (!authenticatedUser.validPassword(password)) {
      // złe hasło
      return done(null, false);
    }
    return done(null, authenticatedUser); // zwracamy zalogowanego usera, prawidłowy email i poprawne hasło
  } catch (error) {
    return done(error);
  }
};

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    authUser
  )
);

export { passport };
