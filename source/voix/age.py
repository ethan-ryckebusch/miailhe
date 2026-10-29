"""Estime l'âge apparent d'une voix (audEERING wav2vec2 âge/genre, 6 couches) : python age.py fichier..."""
import sys, subprocess, numpy as np, torch, torch.nn as nn
from transformers import Wav2Vec2Processor
from transformers.models.wav2vec2.modeling_wav2vec2 import Wav2Vec2Model, Wav2Vec2PreTrainedModel
class Tete(nn.Module):
    def __init__(self, config, n):
        super().__init__(); self.dense = nn.Linear(config.hidden_size, config.hidden_size); self.dropout = nn.Dropout(config.final_dropout); self.out_proj = nn.Linear(config.hidden_size, n)
    def forward(self, x):
        return self.out_proj(self.dropout(torch.tanh(self.dense(self.dropout(x)))))
class AgeGenre(Wav2Vec2PreTrainedModel):
    def __init__(self, config):
        super().__init__(config); self.config = config; self.wav2vec2 = Wav2Vec2Model(config); self.age = Tete(config, 1); self.gender = Tete(config, 3); self.init_weights()
    def forward(self, x):
        h = torch.mean(self.wav2vec2(x)[0], dim=1)
        return self.age(h), torch.softmax(self.gender(h), dim=1)
NOM = 'audeering/wav2vec2-large-robust-6-ft-age-gender'
proc = Wav2Vec2Processor.from_pretrained(NOM); modele = AgeGenre.from_pretrained(NOM).eval()
for f in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    y = proc(x, sampling_rate=16000)['input_values'][0]
    with torch.no_grad():
        age, genre = modele(torch.from_numpy(np.asarray(y)).reshape(1, -1))
    print(f"{f.split('/')[-1]:28s} âge ≈ {age.item()*100:5.1f} ans   (femme {genre[0,0]:.2f}, homme {genre[0,1]:.2f}, enfant {genre[0,2]:.2f})")
