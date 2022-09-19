<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    public function vkontakteRedirect()
    {
        return Socialite::driver('vkontakte')->redirect();
    }
    public function loginWithVkontakte()
    {
        try {

            $user = Socialite::driver('vkontakte')->user();
            $isUser = User::where('vk_id', $user->id)->first();

            if($isUser){
                Auth::login($isUser);
                return redirect('/tasks');
            }else{
                $createUser = User::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'vk_id' => $user->id
                ]);

                Auth::login($createUser);
                return redirect('/tasks');
            }

        } catch (Exception $exception) {
            dd($exception->getMessage());
        }
    }

    public function googleRedirect()
    {
        config()->set('services.google.redirect', env('GOOGLE_REDIRECT_URI'));
        return Socialite::driver('google')->redirect();
    }
    public function loginWithGoogle()
    {
        try {
            config()->set('services.google.redirect', env('GOOGLE_REDIRECT_URI'));
            $user = Socialite::driver('google')->user();
            $isUser = User::where('google_id', $user->id)->first();

            if($isUser){
                Auth::login($isUser);
                return redirect('/tasks');
            }else{
                $createUser = User::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'google_id' => $user->id
                ]);

                Auth::login($createUser);
                return redirect('/tasks');
            }

        } catch (Exception $exception) {
            dd($exception->getMessage());
        }
    }
}
