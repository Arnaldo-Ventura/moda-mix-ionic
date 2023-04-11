import { FormGroup } from '@angular/forms';

export abstract class BaseFormComponent {
  formulario: FormGroup;

  onSubmit() {
    if (this.formulario.valid) {
      this.submit();
    }
  }

  getErrorMessage(campo, artigo, msg) {
    return this.formulario.get(campo).hasError('required')
      ? `${msg} é obrigatóri${artigo}`
      : this.formulario.get(campo).hasError('email') ||
        !this.formulario.get(campo).hasError('minLength')
      ? `${msg} é inválid${artigo}`
      : '';
  }
  abstract submit();
}
