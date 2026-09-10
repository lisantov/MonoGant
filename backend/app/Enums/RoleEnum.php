<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Member = 'member';
    case Owner = 'owner';
    case Responsible = 'responsible';
}
